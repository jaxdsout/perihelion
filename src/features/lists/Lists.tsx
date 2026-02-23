import { useEffect, useRef, useState } from "react";
import { useClientsStore } from "../clients/store";
import "./lists.css";
import OptionsModal from "./OptionsModal";
import { useListsStore } from "./store";
import type { List } from "./types";

type ModalMode = "new" | "detail" | "options" | null;

export default function Lists() {
  const { lists, activeList, loading, loadLists, createList, deleteList, setActiveList } = useListsStore();
  const { clients, loadClients } = useClientsStore();

  const [modal, setModal] = useState<ModalMode>(null);
  const [selectedClient, setSelectedClient] = useState<number | "">("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const deleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadLists();
    if (clients.length === 0) loadClients();
  }, [loadLists, loadClients, clients.length]);

  const openNew = () => { setSelectedClient(""); setModal("new"); };
  const openDetail = (l: List) => { setActiveList(l); setModal("detail"); };
  const openOptions = (l: List) => { setActiveList(l); setModal("options"); };
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

  const shareUrl = (uuid: string) => `${window.location.origin}/list/${uuid}`;

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
                <td onClick={() => openDetail(l)}>{l.client_name}</td>
                <td onClick={() => openDetail(l)}>{l.date?.slice(0, 10)}</td>
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

      {modal === "detail" && activeList && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <h3>List — {activeList.client_name}</h3>
            <div className="detailGrid">
              <div className="detailItem"><label>Created</label><span>{activeList.date?.slice(0, 10)}</span></div>
              <div className="detailItem">
                <label>UUID</label>
                <span style={{ fontSize: "0.7rem", wordBreak: "break-all" }}>{activeList.uuid}</span>
              </div>
            </div>
            <div className="listShareUrl">
              <label>Share Link</label>
              <div className="listShareRow">
                <input readOnly value={shareUrl(activeList.uuid)} className="listShareInput" />
                <button className="tableBtn" onClick={() => navigator.clipboard.writeText(shareUrl(activeList.uuid))}>
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

      {modal === "options" && activeList && (
        <OptionsModal activeList={activeList} onClose={closeModal} />
      )}
    </div>
  );
}
