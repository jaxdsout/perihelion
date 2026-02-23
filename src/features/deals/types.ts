export interface Deal {
  id: number;
  agent: number;
  client: { id: number; first_name: string; last_name: string };
  property: { id: number; address: string };
  rent: string;
  rate: string;
  commission: string;
  flat_fee: string;
  move_date: string;
  unit_no: string;
  lease_term: string;
  is_paid: boolean;
}

export interface DealFormData {
  client: number | "";
  property: number | "";
  rent: string;
  rate: string;
  flat_fee: string;
  move_date: string;
  unit_no: string;
  lease_term: string;
}
