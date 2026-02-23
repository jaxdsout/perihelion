export type DealStatus = 'not' | 'pend' | 'over' | 'paid';

export const DEAL_STATUS_LABELS: Record<DealStatus, string> = {
  not: 'Not Invoiced',
  pend: 'Pending',
  over: 'Overdue',
  paid: 'Paid',
};

export interface Deal {
  id: number;
  agent: number;
  client: number;
  client_name: string;
  property: number;
  prop_name: string;
  rent: number;
  rate: number | null;
  commission: string;
  flat_fee: string | null;
  status: DealStatus;
  move_date: string;
  unit_no: string;
  lease_term: string;
  deal_date: string;
  invoice_date: string | null;
  overdue_date: string | null;
  lease_end_date: string | null;
}

export interface DealFormData {
  client: number | "";
  property: number | "";
  rent: string;
  rate: string;
  commission: string;
  flat_fee: string;
  move_date: string;
  unit_no: string;
  lease_term: string;
  agent: number | "";
}
