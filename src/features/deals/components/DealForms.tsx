import type { Dispatch, SetStateAction } from "react";
import React from "react";
import { useClientsStore } from "../../clients/store";

type ModalMode = "new" | "detail" | "edit" | null;

interface DealFormProps {
  onSubmit: (e: React.FormEvent) => void;
  form: {
    client: number | "";
    property: number | "";
    rent: string;
    rate: string;
    flat_fee: string;
    move_date: string;
    unit_no: string;
    lease_term: string;
  };
  setForm: Dispatch<SetStateAction<DealFormProps["form"]>>;
  closeModal: () => void;
  modal: ModalMode;
}

export default function DealForm({ onSubmit, form, setForm, closeModal, modal }: DealFormProps) {
  const { clients } = useClientsStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <form onSubmit={onSubmit}>
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
        <label>Unit No.</label>
        <input name="unit_no" value={form.unit_no} onChange={handleChange} />
      </div>
      <div className="modalField">
        <label>Monthly Rent ($)</label>
        <input name="rent" type="number" step="any" value={form.rent} onChange={handleChange} required />
      </div>
      <div className="modalField">
        <label>Commission Rate (%)</label>
        <input name="rate" type="number" step="any" value={form.rate} onChange={handleChange} />
      </div>
      <div className="modalField">
        <label>Flat Fee ($)</label>
        <input name="flat_fee" type="number" step="any" value={form.flat_fee} onChange={handleChange} />
      </div>
      <div className="modalField">
        <label>Lease Term (months)</label>
        <input name="lease_term" type="number" value={form.lease_term} onChange={handleChange} />
      </div>
      <div className="modalField">
        <label>Move-In Date</label>
        <input name="move_date" type="date" value={form.move_date} onChange={handleChange} required />
      </div>
      <div className="modalActions">
        <button type="button" className="modalCancelBtn" onClick={closeModal}>Cancel</button>
        <button type="submit" className="modalSubmitBtn">{modal === "edit" ? "SAVE" : "CREATE"}</button>
      </div>
    </form>
  );
}