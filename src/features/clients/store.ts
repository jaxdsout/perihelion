import { create } from "zustand";
import api from "../../globals/api";
import type { Client, ClientFormData } from "./types";

interface ClientsState {
  clients: Client[];
  loading: boolean;
  clientTaken: boolean;
  loadClients: () => Promise<void>;
  createClient: (data: ClientFormData) => Promise<void>;
  deleteClient: (id: number) => Promise<void>;
  verifyClient: (email: string) => Promise<void>;
}

export const useClientsStore = create<ClientsState>((set) => ({
  clients: [],
  loading: false,
  clientTaken: false,

  loadClients: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/clients/");
      set({ clients: data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  createClient: async (payload) => {
    try {
      const { data } = await api.post("/clients/", payload);
      set((s) => ({ clients: [...s.clients, data] }));
    } catch { /* noop */ }
  },

  deleteClient: async (id) => {
    try {
      await api.delete(`/clients/${id}/`);
      set((s) => ({ clients: s.clients.filter((c) => c.id !== id) }));
    } catch { /* noop */ }
  },

  verifyClient: async (email) => {
    try {
      const { data } = await api.get(`/clients/?search=${email}`);
      const taken = Array.isArray(data) && data.some((c: { email: string }) => c.email === email);
      set({ clientTaken: taken });
    } catch {
      set({ clientTaken: false });
    }
  },
}));
