import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import React from "react";
import { useClientsStore } from "../../clients/store";
import { usePropertiesStore } from "../../properties/store";
import type { DealFormData } from "../types";

type ModalMode = "new" | "detail" | "edit" | null;

interface DealFormProps {
  onSubmit: (e: React.FormEvent) => void;
  form: DealFormData;
  setForm: Dispatch<SetStateAction<DealFormData>>;
  closeModal: () => void;
  modal: ModalMode;
}

export default function DealForm({ onSubmit, form, setForm, closeModal, modal }: DealFormProps) {
  const { clients } = useClientsStore();
  const { properties } = usePropertiesStore();
  const [useFlat, setUseFlat] = useState(() => !!form.flat_fee);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => {
      const updated = { ...f, [name]: value };
      if (!useFlat && (name === "rent" || name === "rate")) {
        const rent = parseFloat(name === "rent" ? value : f.rent) || 0;
        const rate = parseFloat(name === "rate" ? value : f.rate) || 0;
        updated.commission = (rent * rate / 100).toFixed(2);
      }
      if (useFlat && name === "flat_fee") {
        updated.commission = value;
      }
      return updated;
    });
  };

  const handleFlatToggle = () => {
    const next = !useFlat;
    setUseFlat(next);
    setForm((f) => {
      if (next) {
        return { ...f, rate: "", commission: f.flat_fee || "0.00" };
      } else {
        const rent = parseFloat(f.rent) || 0;
        const rate = parseFloat(f.rate) || 0;
        return { ...f, flat_fee: "", commission: (rent * rate / 100).toFixed(2) };
      }
    });
  };

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
        <label>Property</label>
        <select name="property" value={form.property} onChange={handleChange} required>
          <option value="">Select property...</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>{p.address}</option>
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
        <label>Flat Fee</label>
        <input type="checkbox" checked={useFlat} onChange={handleFlatToggle} />
      </div>
      {useFlat ? (
        <div className="modalField">
          <label>Flat Fee ($)</label>
          <input name="flat_fee" type="number" step="any" value={form.flat_fee} onChange={handleChange} required />
        </div>
      ) : (
        <div className="modalField">
          <label>Commission Rate (%)</label>
          <input name="rate" type="number" step="any" value={form.rate} onChange={handleChange} />
        </div>
      )}
      <div className="modalField">
        <label>Commission</label>
        <span>${form.commission || "0.00"}</span>
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
