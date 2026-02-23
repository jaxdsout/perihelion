export interface List {
  id: number;
  agent: number;
  client: number;
  client_name: string;
  agent_name: string;
  uuid: string;
  date: string;
  options: Option[];
}

export interface ListFormData {
  client: number | "";
}

export interface Option {
  id: number;
  list: number;
  property: number;
  address: string;
  prop_name: string;
  prop_image: string | null;
  longitude: number | null;
  latitude: number | null;
  website: string | null;
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
