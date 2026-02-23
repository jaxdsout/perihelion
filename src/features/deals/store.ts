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
      console.log("Deal payload:", payload);
      const { data } = await api.post("/deals/", {
        ...payload,
        agent: Number(payload.agent),
        client: Number(payload.client),
        property: Number(payload.property),
        rent: parseInt(payload.rent),
        rate: payload.rate ? parseInt(payload.rate) : null,
        flat_fee: payload.flat_fee ? parseFloat(payload.flat_fee) : null,
        commission: parseFloat(payload.commission),
      });
      set((s) => ({ deals: [...s.deals, data] }));
    } catch { /* noop */ }
  },

  updateDeal: async (id, payload) => {
    try {
      const { data } = await api.patch(`/deals/${id}/`, {
        ...payload,
        client: payload.client ? Number(payload.client) : undefined,
        property: payload.property ? Number(payload.property) : undefined,
        rent: payload.rent ? parseInt(payload.rent) : undefined,
        rate: payload.rate ? parseInt(payload.rate) : null,
        flat_fee: payload.flat_fee ? parseFloat(payload.flat_fee) : null,
        commission: payload.commission ? parseFloat(payload.commission) : undefined,
      });
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
      const { data } = await api.patch(`/deals/${id}/`, { status: 'paid' });
      set((s) => ({ deals: s.deals.map((d) => (d.id === id ? data : d)) }));
    } catch { /* noop */ }
  },
}));
