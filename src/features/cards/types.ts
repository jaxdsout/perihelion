export interface Card {
  id: number;
  agent: number;
  client: number;
  client_name: string;
  property: number | null;
  prop_name: string | null;
  msg: string;
  interested: "yes" | "no" | "maybe" | "";
  move_by: string;
  date: string;
}

export interface CardFormData {
  client: number | "";
  property: number | "";
  msg: string;
  interested: string;
  move_by: string;
}
