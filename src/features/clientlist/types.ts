interface PublicOption {
  id: number;
  property: number;
  prop_name: string;
  prop_image: string | null;
  latitude: string;
  longitude: string;
  address: string;
  website: string;
  price: string;
  unit_number: string;
  layout: string;
  sq_ft: string;
  available: string;
  notes: string;
  order: number;
  list: number;
}

export interface PublicList {
  id: number;
  uuid: string;
  client: number;
  client_name: string;
  agent: number;
  agent_name: string;
  agent_avatar: string;
  agent_phone: string;
  agent_email: string;
  options: PublicOption[];
}