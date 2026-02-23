export interface List {
  id: number;
  agent: number;
  client: { id: number; first_name: string; last_name: string };
  uuid: string;
  created_at: string;
}

export interface ListFormData {
  client: number | "";
}

export interface Option {
  id: number;
  list: number;
  property: { id: number; address: string; borough: string };
  price: string;
  unit_number: string;
  layout: string;
  sq_ft: string;
  available: string;
  notes: string;
  order: number;
}

export interface OptionFormData {
  property: number | "";
  price: string;
  unit_number: string;
  layout: string;
  sq_ft: string;
  available: string;
  notes: string;
}
