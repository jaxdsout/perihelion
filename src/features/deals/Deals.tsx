import { useAuthStore } from "@/features/auth/store";
import { useEffect, useRef, useState } from "react";
import { useClientsStore } from "../clients/store";
import { usePropertiesStore } from "../properties/store";
import DealForm from "./components/DealForms";
import { useDealsStore } from "./store";
import type { Deal, DealFormData } from "./types";
import { DEAL_STATUS_LABELS } from "./types";

type ModalMode = "new" | "detail" | "edit" | null;

const emptyForm: DealFormData = {
  client: "",
  property: "",
  rent: "",
  rate: "",
  commission: "0.00",
  flat_fee: "",
  move_date: "",
  unit_no: "",
  lease_term: "",
  agent: ""
};

export default function Deals() {
  const { deals, loading, loadDeals, createDeal, updateDeal, deleteDeal, setPaid } = useDealsStore();
  const { clients, loadClients } = useClientsStore();
  const { properties, loadProperties } = usePropertiesStore();
  const { user } = useAuthStore.getState();

  const [modal, setModal] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Deal | null>(null);
  const [form, setForm] = useState<DealFormData>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [paidConfirm, setPaidConfirm] = useState<number | null>(null);
  const deleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paidTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadDeals();
    if (clients.length === 0) loadClients();
    if (properties.length === 0) loadProperties();
  }, [loadDeals, loadClients, loadProperties, clients.length, properties.length]);

  const openNew = () => { setForm({ ...emptyForm, agent: user?.id ?? "" }); setModal("new"); };
  const openDetail = (d: Deal) => { setSelected(d); setModal("detail"); };
  const openEdit = (d: Deal) => {
    setSelected(d);
    setForm({
      property: d.property,
      client: d.client,
      unit_no: d.unit_no,
      move_date: d.move_date,
      lease_term: d.lease_term,
      rent: String(d.rent),
      rate: d.rate !== null ? String(d.rate) : "",
      flat_fee: d.flat_fee ?? "",
      commission: d.commission,
      agent: d.agent,
    });
    setModal("edit");
  };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDeal(form);
    closeModal();
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    await updateDeal(selected.id, form);
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (deleteConfirm === id) {
      deleteDeal(id);
      setDeleteConfirm(null);
      if (deleteTimer.current) clearTimeout(deleteTimer.current);
      closeModal();
    } else {
      setDeleteConfirm(id);
      deleteTimer.current = setTimeout(() => setDeleteConfirm(null), 5000);
    }
  };

  const handlePaid = (id: number) => {
    if (paidConfirm === id) {
      setPaid(id);
      setPaidConfirm(null);
      if (paidTimer.current) clearTimeout(paidTimer.current);
    } else {
      setPaidConfirm(id);
      paidTimer.current = setTimeout(() => setPaidConfirm(null), 5000);
    }
  };

  console.log(user)

  return (
    <div className="featurePage">
      <div className="featureHeader">
        <h2>Deals</h2>
        <button className="featureAddBtn" onClick={openNew}>+ NEW DEAL</button>
      </div>

      {loading && deals.length === 0 ? (
        <p className="emptyState">Loading...</p>
      ) : deals.length === 0 ? (
        <p className="emptyState">No deals yet.</p>
      ) : (
        <table className="featureTable">
          <thead>
            <tr>
              <th>Client</th>
              <th>Property</th>
              <th>Move Date</th>
              <th>Rent</th>
              <th>Commission</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {deals.map((d) => (
              <tr key={d.id}>
                <td onClick={() => openDetail(d)}>{d.client_name}</td>
                <td onClick={() => openDetail(d)}>{d.prop_name || "—"}</td>
                <td onClick={() => openDetail(d)}>{d.move_date}</td>
                <td onClick={() => openDetail(d)}>${d.rent}</td>
                <td onClick={() => openDetail(d)}>${d.commission}</td>
                <td>
                  {d.status === 'paid' ? (
                    <span style={{ color: "#4ade80", fontSize: "0.75rem" }}>PAID</span>
                  ) : (
                    <button
                      className={`tableBtn ${paidConfirm === d.id ? "confirm" : ""}`}
                      onClick={() => handlePaid(d.id)}
                    >
                      {paidConfirm === d.id ? "CONFIRM PAID" : "Set Paid"}
                    </button>
                  )}
                </td>
                <td>
                  <button className="tableBtn" onClick={() => openEdit(d)}>Edit</button>
                  <button
                    className={`tableBtn ${deleteConfirm === d.id ? "confirm" : "danger"}`}
                    onClick={() => handleDelete(d.id)}
                  >
                    {deleteConfirm === d.id ? "CONFIRM" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modal === "new" && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <h3>New Deal</h3>
            <DealForm onSubmit={handleCreate} form={form} setForm={setForm} closeModal={closeModal} modal={modal} />
          </div>
        </div>
      )}

      {modal === "edit" && selected && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Deal</h3>
            <DealForm onSubmit={handleEdit} form={form} setForm={setForm} closeModal={closeModal} modal={modal} />
          </div>
        </div>
      )}

      {modal === "detail" && selected && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <h3>Deal Detail</h3>
            <div className="detailGrid">
              <div className="detailItem"><label>Client</label><span>{selected.client_name}</span></div>
              <div className="detailItem"><label>Property</label><span>{selected.prop_name || "—"}</span></div>
              <div className="detailItem"><label>Unit No.</label><span>{selected.unit_no || "—"}</span></div>
              <div className="detailItem"><label>Lease Term</label><span>{selected.lease_term} mos</span></div>
              <div className="detailItem"><label>Monthly Rent</label><span>${selected.rent}</span></div>
              <div className="detailItem"><label>Commission</label><span>${selected.commission}</span></div>
              {selected.rate && <div className="detailItem"><label>Rate</label><span>{selected.rate}%</span></div>}
              {selected.flat_fee && <div className="detailItem"><label>Flat Fee</label><span>${selected.flat_fee}</span></div>}
              <div className="detailItem"><label>Move Date</label><span>{selected.move_date}</span></div>
              {selected.lease_end_date && <div className="detailItem"><label>Lease End</label><span>{selected.lease_end_date}</span></div>}
              <div className="detailItem"><label>Deal Date</label><span>{selected.deal_date}</span></div>
              <div className="detailItem"><label>Status</label><span>{DEAL_STATUS_LABELS[selected.status]}</span></div>
            </div>
            <div className="modalActions">
              <button className="tableBtn" onClick={() => openEdit(selected)}>Edit</button>
              <button
                className={`tableBtn ${deleteConfirm === selected.id ? "confirm" : "danger"}`}
                onClick={() => handleDelete(selected.id)}
              >
                {deleteConfirm === selected.id ? "CONFIRM DELETE" : "Delete"}
              </button>
              <button className="modalCancelBtn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
