export interface Card {
  id: number;
  agent: number;
  client: { id: number; first_name: string; last_name: string };
  property: { id: number; address: string };
  body: string;
  interested: "yes" | "no" | "maybe" | "";
  move_by: string;
}

export interface CardFormData {
  client: number | "";
  property: number | "";
  body: string;
  interested: string;
  move_by: string;
}
