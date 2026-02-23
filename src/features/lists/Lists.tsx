import { useEffect, useRef, useState } from "react";
import { useClientsStore } from "../clients/store";
import "./lists.css";
import { useListsStore } from "./store";
import type { List, Option } from "./types";

type ModalMode = "new" | "detail" | "options" | null;

const emptyOptionForm = {
  property: "" as number | "",
  price: "",
  unit_number: "",
  layout: "",
  sq_ft: "",
  available: "",
  notes: "",
};

export default function Lists() {
  const {
    lists, options, activeList, loading,
    loadLists, createList, deleteList, setActiveList,
    loadOptions, addOption, removeOption, updateOption, reorderOptions,
  } = useListsStore();
  const { clients, loadClients } = useClientsStore();

  const [modal, setModal] = useState<ModalMode>(null);
  const [selectedClient, setSelectedClient] = useState<number | "">("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const deleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [optionForm, setOptionForm] = useState(emptyOptionForm);
  const [editingOption, setEditingOption] = useState<Option | null>(null);
  const [isReorderMode, setIsReorderMode] = useState(false);

  useEffect(() => {
    loadLists();
    if (clients.length === 0) loadClients();
  }, [loadLists, loadClients, clients.length]);

  const openNew = () => { setSelectedClient(""); setModal("new"); };
  const openDetail = (l: List) => { setActiveList(l); setModal("detail"); };

  const openOptions = (l: List) => {
    setActiveList(l);
    loadOptions(l.id);
    setOptionForm(emptyOptionForm);
    setEditingOption(null);
    setIsReorderMode(false);
    setModal("options");
  };

  const closeModal = () => { setModal(null); setActiveList(null); };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    const list = await createList(Number(selectedClient));
    if (list) openOptions(list);
    else closeModal();
  };

  const handleDelete = (id: number) => {
    if (deleteConfirm === id) {
      deleteList(id);
      setDeleteConfirm(null);
      if (deleteTimer.current) clearTimeout(deleteTimer.current);
      closeModal();
    } else {
      setDeleteConfirm(id);
      deleteTimer.current = setTimeout(() => setDeleteConfirm(null), 5000);
    }
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setOptionForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleAddOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeList) return;
    if (editingOption) {
      await updateOption(editingOption.id, optionForm);
      setEditingOption(null);
    } else {
      await addOption(activeList.id, optionForm);
    }
    setOptionForm(emptyOptionForm);
  };

  const startEditOption = (o: Option) => {
    setEditingOption(o);
    setOptionForm({
      property: o.property.id,
      price: o.price,
      unit_number: o.unit_number,
      layout: o.layout,
      sq_ft: o.sq_ft,
      available: o.available,
      notes: o.notes,
    });
  };

  const publicUrl = activeList ? `${window.location.origin}/list/${activeList.uuid}` : "";

  const sortedOptions = [...options].sort((a, b) => a.order - b.order);

  return (
    <div className="featurePage">
      <div className="featureHeader">
        <h2>Lists</h2>
        <button className="featureAddBtn" onClick={openNew}>+ NEW LIST</button>
      </div>

      {loading && lists.length === 0 ? (
        <p className="emptyState">Loading...</p>
      ) : lists.length === 0 ? (
        <p className="emptyState">No lists yet.</p>
      ) : (
        <table className="featureTable">
          <thead>
            <tr>
              <th>Client</th>
              <th>Created</th>
              <th>Options</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lists.map((l) => (
              <tr key={l.id}>
                <td onClick={() => openDetail(l)}>{l.client.first_name} {l.client.last_name}</td>
                <td onClick={() => openDetail(l)}>{l.created_at?.slice(0, 10)}</td>
                <td>
                  <button className="tableBtn" onClick={() => openOptions(l)}>
                    <i className="fa-solid fa-list" /> Manage
                  </button>
                </td>
                <td>
                  <button
                    className={`tableBtn ${deleteConfirm === l.id ? "confirm" : "danger"}`}
                    onClick={() => handleDelete(l.id)}
                  >
                    {deleteConfirm === l.id ? "CONFIRM" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* New list modal */}
      {modal === "new" && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <h3>New List</h3>
            <form onSubmit={handleCreate}>
              <div className="modalField">
                <label>Select Client</label>
                <select value={selectedClient} onChange={(e) => setSelectedClient(Number(e.target.value))} required>
                  <option value="">Choose a client...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                  ))}
                </select>
              </div>
              <div className="modalActions">
                <button type="button" className="modalCancelBtn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="modalSubmitBtn">CREATE & ADD OPTIONS</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {modal === "detail" && activeList && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <h3>List — {activeList.client.first_name} {activeList.client.last_name}</h3>
            <div className="detailGrid">
              <div className="detailItem"><label>Created</label><span>{activeList.created_at?.slice(0, 10)}</span></div>
              <div className="detailItem"><label>UUID</label><span style={{ fontSize: "0.7rem", wordBreak: "break-all" }}>{activeList.uuid}</span></div>
            </div>
            <div className="listShareUrl">
              <label>Share Link</label>
              <div className="listShareRow">
                <input readOnly value={publicUrl} className="listShareInput" />
                <button className="tableBtn" onClick={() => navigator.clipboard.writeText(publicUrl)}>
                  <i className="fa-solid fa-copy" /> Copy
                </button>
              </div>
            </div>
            <div className="modalActions">
              <button className="tableBtn" onClick={() => openOptions(activeList)}>Manage Options</button>
              <button
                className={`tableBtn ${deleteConfirm === activeList.id ? "confirm" : "danger"}`}
                onClick={() => handleDelete(activeList.id)}
              >
                {deleteConfirm === activeList.id ? "CONFIRM DELETE" : "Delete"}
              </button>
              <button className="modalCancelBtn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Options modal */}
      {modal === "options" && activeList && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="optionsModal" onClick={(e) => e.stopPropagation()}>
            <div className="optionsHeader">
              <h3>Options — {activeList.client.first_name} {activeList.client.last_name}</h3>
              <div className="optionsHeaderActions">
                <button className={`tableBtn${isReorderMode ? " confirm" : ""}`} onClick={() => setIsReorderMode(!isReorderMode)}>
                  {isReorderMode ? "Done" : "Reorder"}
                </button>
                <button className="modalCancelBtn" onClick={closeModal}>Close</button>
              </div>
            </div>

            <div className="optionsBody">
              {/* Options list */}
              <div className="optionsList">
                {sortedOptions.length === 0 && <p className="emptyState">No options yet. Add one below.</p>}
                {sortedOptions.map((o) => (
                  <div key={o.id} className="optionCard">
                    {isReorderMode && (
                      <div className="reorderBtns">
                        <button className="tableBtn" onClick={() => reorderOptions(o.id, "up")}>▲</button>
                        <button className="tableBtn" onClick={() => reorderOptions(o.id, "down")}>▼</button>
                      </div>
                    )}
                    <div className="optionCardBody">
                      <div className="optionCardAddress">{o.property?.address || "—"}</div>
                      <div className="optionCardDetails">
                        {o.unit_number && <span>Unit {o.unit_number}</span>}
                        {o.price && <span>${o.price}/mo</span>}
                        {o.layout && <span>{o.layout}</span>}
                        {o.sq_ft && <span>{o.sq_ft} sqft</span>}
                        {o.available && <span>Avail: {o.available}</span>}
                      </div>
                      {o.notes && <div className="optionCardNotes">{o.notes}</div>}
                    </div>
                    <div className="optionCardActions">
                      <button className="tableBtn" onClick={() => startEditOption(o)}>Edit</button>
                      <button className="tableBtn danger" onClick={() => removeOption(o.id)}>
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add/edit option form */}
              <div className="optionForm">
                <h4>{editingOption ? "Edit Option" : "Add Option"}</h4>
                <form onSubmit={handleAddOption}>
                  <div className="modalField">
                    <label>Unit No.</label>
                    <input name="unit_number" value={optionForm.unit_number} onChange={handleOptionChange} />
                  </div>
                  <div className="modalField">
                    <label>Price ($/mo)</label>
                    <input name="price" type="number" step="any" value={optionForm.price} onChange={handleOptionChange} />
                  </div>
                  <div className="modalField">
                    <label>Layout</label>
                    <input name="layout" placeholder="1BR, 2BR..." value={optionForm.layout} onChange={handleOptionChange} />
                  </div>
                  <div className="modalField">
                    <label>Sq Ft</label>
                    <input name="sq_ft" type="number" value={optionForm.sq_ft} onChange={handleOptionChange} />
                  </div>
                  <div className="modalField">
                    <label>Available</label>
                    <input name="available" type="date" value={optionForm.available} onChange={handleOptionChange} />
                  </div>
                  <div className="modalField">
                    <label>Notes</label>
                    <textarea name="notes" value={optionForm.notes} onChange={handleOptionChange} />
                  </div>
                  <div className="modalActions">
                    {editingOption && (
                      <button type="button" className="modalCancelBtn" onClick={() => { setEditingOption(null); setOptionForm(emptyOptionForm); }}>
                        Cancel Edit
                      </button>
                    )}
                    <button type="submit" className="modalSubmitBtn">
                      {editingOption ? "SAVE" : "ADD"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Share row */}
            <div className="optionsFooter">
              <label style={{ color: "#555", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Share Link</label>
              <div className="listShareRow">
                <input readOnly value={publicUrl} className="listShareInput" />
                <button className="tableBtn" onClick={() => navigator.clipboard.writeText(publicUrl)}>
                  <i className="fa-solid fa-copy" /> Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
