import { create } from "zustand";
import api from "../../globals/api";
import type { Deal, DealFormData } from "./types";

interface DealsState {
  deals: Deal[];
  loading: boolean;
  loadDeals: () => Promise<void>;
  createDeal: (data: DealFormData) => Promise<void>;
  updateDeal: (id: number, data: Partial<DealFormData>) => Promise<void>;
  deleteDeal: (id: number) => Promise<void>;
  setPaid: (id: number) => Promise<void>;
}

export const useDealsStore = create<DealsState>((set) => ({
  deals: [],
  loading: false,

  loadDeals: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/deals/");
      set({ deals: data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  createDeal: async (payload) => {
    try {
      const { data } = await api.post("/deals/", payload);
      set((s) => ({ deals: [...s.deals, data] }));
    } catch { /* noop */ }
  },

  updateDeal: async (id, payload) => {
    try {
      const { data } = await api.patch(`/deals/${id}/`, payload);
      set((s) => ({ deals: s.deals.map((d) => (d.id === id ? data : d)) }));
    } catch { /* noop */ }
  },

  deleteDeal: async (id) => {
    try {
      await api.delete(`/deals/${id}/`);
      set((s) => ({ deals: s.deals.filter((d) => d.id !== id) }));
    } catch { /* noop */ }
  },

  setPaid: async (id) => {
    try {
      const { data } = await api.patch(`/deals/${id}/`, { is_paid: true });
      set((s) => ({ deals: s.deals.map((d) => (d.id === id ? data : d)) }));
    } catch { /* noop */ }
  },
}));
