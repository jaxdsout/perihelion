import { useEffect, useRef, useState } from "react";
import { useClientsStore } from "../clients/store";
import "./cards.css";
import { useCardsStore } from "./store";
import type { Card } from "./types";

type ModalMode = "new" | "detail" | null;

const emptyForm = {
  client: "" as number | "",
  property: "" as number | "",
  body: "",
  interested: "",
  move_by: "",
};

const interestedLabel = (v: string) => {
  if (v === "yes") return { text: "Interested", color: "#4ade80" };
  if (v === "no") return { text: "Not Interested", color: "#f87171" };
  if (v === "maybe") return { text: "Maybe", color: "#fbbf24" };
  return { text: "—", color: "#555" };
};

export default function Cards() {
  const { cards, loading, loadCards, createCard, deleteCard } = useCardsStore();
  const { clients, loadClients } = useClientsStore();

  const [modal, setModal] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Card | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const deleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadCards();
    if (clients.length === 0) loadClients();
  }, [loadCards, loadClients, clients.length]);

  const openNew = () => { setForm(emptyForm); setModal("new"); };
  const openDetail = (c: Card) => { setSelected(c); setModal("detail"); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCard(form);
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (deleteConfirm === id) {
      deleteCard(id);
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
        <h2>Client Cards</h2>
        <button className="featureAddBtn" onClick={openNew}>+ NEW CARD</button>
      </div>

      {loading && cards.length === 0 ? (
        <p className="emptyState">Loading...</p>
      ) : cards.length === 0 ? (
        <p className="emptyState">No cards yet.</p>
      ) : (
        <div className="cardsGrid">
          {cards.map((c) => {
            const label = interestedLabel(c.interested);
            return (
              <div key={c.id} className="cardTile" onClick={() => openDetail(c)}>
                <div className="cardTileHeader">
                  <span className="cardTileName">{c.client.first_name} {c.client.last_name}</span>
                  <span className="cardTileStatus" style={{ color: label.color }}>{label.text}</span>
                </div>
                {c.property?.address && (
                  <div className="cardTileAddress">{c.property.address}</div>
                )}
                {c.body && <p className="cardTileBody">{c.body}</p>}
                {c.move_by && <div className="cardTileMeta">Move by: {c.move_by}</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* New card modal */}
      {modal === "new" && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <h3>New Client Card</h3>
            <form onSubmit={handleCreate}>
              <div className="modalField">
                <label>Client</label>
                <select name="client" value={form.client} onChange={handleChange} required>
                  <option value="">Select client...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                  ))}
                </select>
              </div>
              <div className="modalField">
                <label>Notes / Body</label>
                <textarea name="body" value={form.body} onChange={handleChange} />
              </div>
              <div className="modalField">
                <label>Interest Level</label>
                <select name="interested" value={form.interested} onChange={handleChange}>
                  <option value="">Not set</option>
                  <option value="yes">Interested</option>
                  <option value="maybe">Maybe</option>
                  <option value="no">Not Interested</option>
                </select>
              </div>
              <div className="modalField">
                <label>Move-By Date</label>
                <input name="move_by" type="date" value={form.move_by} onChange={handleChange} />
              </div>
              <div className="modalActions">
                <button type="button" className="modalCancelBtn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="modalSubmitBtn">CREATE</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {modal === "detail" && selected && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <h3>{selected.client.first_name} {selected.client.last_name}</h3>
            <div className="detailGrid">
              <div className="detailItem">
                <label>Property</label>
                <span>{selected.property?.address || "—"}</span>
              </div>
              <div className="detailItem">
                <label>Interest</label>
                <span style={{ color: interestedLabel(selected.interested).color }}>
                  {interestedLabel(selected.interested).text}
                </span>
              </div>
              <div className="detailItem">
                <label>Move By</label>
                <span>{selected.move_by || "—"}</span>
              </div>
            </div>
            {selected.body && (
              <div className="modalField">
                <label>Notes</label>
                <p style={{ color: "#ccc", fontSize: "0.875rem", margin: 0 }}>{selected.body}</p>
              </div>
            )}
            <div className="modalActions">
              <button
                className={`tableBtn ${deleteConfirm === selected.id ? "confirm" : "danger"}`}
                onClick={() => handleDelete(selected.id)}
              >
                {deleteConfirm === selected.id ? "CONFIRM DELETE" : "Delete Card"}
              </button>
              <button className="modalCancelBtn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
