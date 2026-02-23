import { create } from "zustand";
import api from "../../globals/api";
import type { Property } from "./types";

interface PropertiesState {
  properties: Property[];
  polygonProps: Property[];
  loading: boolean;
  searchQuery: string;
  loadProperties: () => Promise<void>;
  setPolygonProps: (props: Property[]) => void;
  setSearchQuery: (q: string) => void;
}

export const usePropertiesStore = create<PropertiesState>((set) => ({
  properties: [],
  polygonProps: [],
  loading: false,
  searchQuery: "",

  loadProperties: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/properties/");
      set({ properties: data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  setPolygonProps: (props) => set({ polygonProps: props }),
  setSearchQuery: (q) => set({ searchQuery: q }),
}));
