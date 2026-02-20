import { useState } from "react";

interface FormData {
  lease_term: number | "";
  rent_free: number | "";
  cash_allowance: number | "";
  monthly_rent: number | "";
  net_effective: number;
}

export default function Calculator() {
  const [formData, setFormData] = useState<FormData>({
    lease_term: 0,
    rent_free: 0,
    cash_allowance: 0,
    monthly_rent: 0,
    net_effective: 0,
  });

  const { lease_term, rent_free, cash_allowance, monthly_rent, net_effective } = formData;

  const calculateNER = (data: FormData): number => {
    const { lease_term, rent_free, cash_allowance, monthly_rent } = data;

    if (Number(lease_term) > 0) {
      return cash_allowance
        ? Math.round(
          (((Number(monthly_rent) * (Number(lease_term) - Number(rent_free))) - Number(cash_allowance)) /
            Number(lease_term)) *
          100
        ) / 100
        : Math.round(
          ((Number(monthly_rent) * (Number(lease_term) - Number(rent_free))) / Number(lease_term)) * 100
        ) / 100;
    }
    return 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value === "" ? "" : parseFloat(value);
    const updatedFormData = { ...formData, [name]: numericValue };
    const updatedNetEffective = calculateNER(updatedFormData as FormData);

    setFormData({
      ...updatedFormData,
      net_effective: updatedNetEffective,
    });
  };

  const handleReset = () => {
    setFormData({
      lease_term: 0,
      rent_free: 0,
      cash_allowance: 0,
      monthly_rent: 0,
      net_effective: 0,
    });
  };

  return (
    <div>
      <div>
        <h4>Net Effective Rent Calculator</h4>
      </div>
      <div>
        <div>
          <label htmlFor="lease_term">Lease Term:</label>
          <div>
            <span>mos</span>
            <input
              type="number"
              id="lease_term"
              name="lease_term"
              value={lease_term}
              autoComplete="off"
              onChange={handleChange}
            />
          </div>

          <label htmlFor="monthly_rent">Monthly Rent:</label>
          <div>
            <span>$</span>
            <span>/ mo</span>
            <input
              type="number"
              step="any"
              id="monthly_rent"
              name="monthly_rent"
              value={monthly_rent}
              autoComplete="off"
              onChange={handleChange}
            />
          </div>
        </div>
        <hr />
        <div>
          <label htmlFor="rent_free">No. of Rent-Free Months:</label>
          <div>
            <span>mos</span>
            <input
              type="number"
              step="any"
              id="rent_free"
              name="rent_free"
              value={rent_free}
              autoComplete="off"
              onChange={handleChange}
            />
          </div>

          <label htmlFor="cash_allowance">Tenant Cash Allowance:</label>
          <div>
            <span>$</span>
            <input
              type="number"
              id="cash_allowance"
              name="cash_allowance"
              value={cash_allowance}
              autoComplete="off"
              onChange={handleChange}
            />
          </div>
        </div>
        <hr />
        <div>
          <label htmlFor="net_effective">Net Effective Rent:</label>
          <div>
            <span>$</span>
            <span>/ mo</span>
            <input
              type="text"
              id="net_effective"
              name="net_effective"
              value={net_effective}
              placeholder="0"
              autoComplete="off"
              readOnly
            />
          </div>
        </div>
      </div>
      <div>
        {net_effective > 0 ? (
          <button onClick={handleReset}>RESET</button>
        ) : null}
      </div>
    </div>
  );
}