export interface Client {
  id: number;
  agent: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  lists: { id: number; date: string; uuid: string }[];
  deals: { id: number; commission: string; status: string; move_date: string }[];
}

export interface ClientFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}
