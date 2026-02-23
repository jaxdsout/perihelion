import { useEffect, useState } from "react";
import { usePropertiesStore } from "../properties/store";
import { useListsStore } from "./store";
import type { List, Option, OptionFormData } from "./types";

const emptyOptionForm: OptionFormData = {
  property: "",
  price: "",
  unit_number: "",
  layout: "",
  sq_ft: "",
  available: "",
  notes: "",
};

interface Props {
  activeList: List;
  onClose: () => void;
}

export default function OptionsModal({ activeList, onClose }: Props) {
  const { options, loadOptions, addOption, removeOption, updateOption, reorderOptions } = useListsStore();
  const { properties, loadProperties } = usePropertiesStore();

  const [optionForm, setOptionForm] = useState<OptionFormData>(emptyOptionForm);
  const [editingOption, setEditingOption] = useState<Option | null>(null);
  const [isReorderMode, setIsReorderMode] = useState(false);

  useEffect(() => {
    loadOptions(activeList.id);
    if (properties.length === 0) loadProperties();
  }, [activeList.id, loadOptions, loadProperties, properties.length]);

  const handleOptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setOptionForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      property: o.property,
      price: o.price,
      unit_number: o.unit_number,
      layout: o.layout,
      sq_ft: o.sq_ft,
      available: o.available,
      notes: o.notes,
    });
  };

  const publicUrl = `${window.location.origin}/list/${activeList.uuid}`;
  const sortedOptions = [...options].sort((a, b) => a.order - b.order);

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="optionsModal" onClick={(e) => e.stopPropagation()}>
        <div className="optionsHeader">
          <h3>Options — {activeList.client_name}</h3>
          <div className="optionsHeaderActions">
            <button
              className={`tableBtn${isReorderMode ? " confirm" : ""}`}
              onClick={() => setIsReorderMode(!isReorderMode)}
            >
              {isReorderMode ? "Done" : "Reorder"}
            </button>
            <button className="modalCancelBtn" onClick={onClose}>Close</button>
          </div>
        </div>

        <div className="optionsBody">
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
                  <div className="optionCardAddress">{o.address || o.prop_name || "—"}</div>
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

          <div className="optionForm">
            <h4>{editingOption ? "Edit Option" : "Add Option"}</h4>
            <form onSubmit={handleSubmit}>
              <div className="modalField">
                <label>Property</label>
                <select name="property" value={optionForm.property} onChange={handleOptionChange} required>
                  <option value="">Select property...</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.address}</option>
                  ))}
                </select>
              </div>
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
                  <button
                    type="button"
                    className="modalCancelBtn"
                    onClick={() => { setEditingOption(null); setOptionForm(emptyOptionForm); }}
                  >
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

        <div className="optionsFooter">
          <label style={{ color: "#555", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Share Link
          </label>
          <div className="listShareRow">
            <input readOnly value={publicUrl} className="listShareInput" />
            <button className="tableBtn" onClick={() => navigator.clipboard.writeText(publicUrl)}>
              <i className="fa-solid fa-copy" /> Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
