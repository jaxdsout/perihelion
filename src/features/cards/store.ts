import { create } from "zustand";
import api from "../../globals/api";
import type { Card, CardFormData } from "./types";

interface CardsState {
  cards: Card[];
  loading: boolean;
  loadCards: () => Promise<void>;
  createCard: (data: CardFormData) => Promise<void>;
  deleteCard: (id: number) => Promise<void>;
}

export const useCardsStore = create<CardsState>((set) => ({
  cards: [],
  loading: false,

  loadCards: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/cards/");
      set({ cards: data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  createCard: async (payload) => {
    try {
      const { data } = await api.post("/cards/", payload);
      set((s) => ({ cards: [...s.cards, data] }));
    } catch { /* noop */ }
  },

  deleteCard: async (id) => {
    try {
      await api.delete(`/cards/${id}/`);
      set((s) => ({ cards: s.cards.filter((c) => c.id !== id) }));
    } catch { /* noop */ }
  },
}));
