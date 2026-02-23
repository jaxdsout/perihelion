import { useEffect, useRef, useState } from "react";
import "./clients.css";
import { useClientsStore } from "./store";
import type { Client } from "./types";

type ModalMode = "new" | "detail" | null;

const emptyForm = { first_name: "", last_name: "", email: "", phone_number: "" };

export default function Clients() {
  const { clients, loading, clientTaken, loadClients, createClient, deleteClient, verifyClient } =
    useClientsStore();

  const [modal, setModal] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Client | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const deleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const openNew = () => {
    setForm(emptyForm);
    setModal("new");
  };

  const openDetail = (c: Client) => {
    setSelected(c);
    setModal("detail");
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === "email" && value.includes("@")) verifyClient(value);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createClient(form);
    closeModal();
  };

  const handleDeleteClick = (id: number) => {
    if (deleteConfirm === id) {
      deleteClient(id);
      setDeleteConfirm(null);
      if (deleteTimer.current) clearTimeout(deleteTimer.current);
      closeModal();
    } else {
      setDeleteConfirm(id);
      deleteTimer.current = setTimeout(() => setDeleteConfirm(null), 5000);
    }
  };

  return (
    <div className="featurePage">
      <div className="featureHeader">
        <h2>Clients</h2>
        <button className="featureAddBtn" onClick={openNew}>+ NEW CLIENT</button>
      </div>

      {loading && clients.length === 0 ? (
        <p className="emptyState">Loading...</p>
      ) : clients.length === 0 ? (
        <p className="emptyState">No clients yet. Add your first client.</p>
      ) : (
        <table className="featureTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id}>
                <td onClick={() => openDetail(c)}>{c.first_name} {c.last_name}</td>
                <td onClick={() => openDetail(c)}>{c.email}</td>
                <td onClick={() => openDetail(c)}>{c.phone_number}</td>
                <td>
                  <button
                    className={`tableBtn ${deleteConfirm === c.id ? "confirm" : "danger"}`}
                    onClick={() => handleDeleteClick(c.id)}
                  >
                    {deleteConfirm === c.id ? "CONFIRM DELETE" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* New client modal */}
      {modal === "new" && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <h3>New Client</h3>
            {clientTaken && (
              <div className="warningBanner">
                <i className="fa-solid fa-triangle-exclamation" /> This client is already associated with another agent.
              </div>
            )}
            <form onSubmit={handleCreate}>
              <div className="modalField">
                <label>First Name</label>
                <input name="first_name" value={form.first_name} onChange={handleChange} required />
              </div>
              <div className="modalField">
                <label>Last Name</label>
                <input name="last_name" value={form.last_name} onChange={handleChange} required />
              </div>
              <div className="modalField">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="modalField">
                <label>Phone Number</label>
                <input name="phone_number" value={form.phone_number} onChange={handleChange} />
              </div>
              <div className="modalActions">
                <button type="button" className="modalCancelBtn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="modalSubmitBtn">CREATE</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client detail modal */}
      {modal === "detail" && selected && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <h3>{selected.first_name} {selected.last_name}</h3>
            <div className="detailGrid">
              <div className="detailItem">
                <label>Email</label>
                <span>{selected.email}</span>
              </div>
              <div className="detailItem">
                <label>Phone</label>
                <span>{selected.phone_number || "—"}</span>
              </div>
            </div>
            <div className="modalActions">
              <button
                className={`tableBtn ${deleteConfirm === selected.id ? "confirm" : "danger"}`}
                onClick={() => handleDeleteClick(selected.id)}
              >
                {deleteConfirm === selected.id ? "CONFIRM DELETE" : "Delete Client"}
              </button>
              <button className="modalCancelBtn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
