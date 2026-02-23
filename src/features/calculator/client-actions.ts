import type { CalculatorState } from "./types";

export const calculateNER = (data: CalculatorState): number => {
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