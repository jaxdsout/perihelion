import { create } from "zustand";
import api from "../../globals/api";
import type { List, Option, OptionFormData } from "./types";

interface ListsState {
  lists: List[];
  options: Option[];
  activeList: List | null;
  loading: boolean;
  loadLists: () => Promise<void>;
  createList: (clientId: number) => Promise<List | null>;
  deleteList: (id: number) => Promise<void>;
  setActiveList: (list: List | null) => void;
  loadOptions: (listId: number) => Promise<void>;
  addOption: (listId: number, data: OptionFormData) => Promise<void>;
  removeOption: (optionId: number) => Promise<void>;
  updateOption: (optionId: number, data: Partial<OptionFormData & { order: number }>) => Promise<void>;
  reorderOptions: (optionId: number, direction: "up" | "down") => Promise<void>;
}

export const useListsStore = create<ListsState>((set, get) => ({
  lists: [],
  options: [],
  activeList: null,
  loading: false,

  loadLists: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/lists/");
      set({ lists: data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  createList: async (clientId) => {
    try {
      const { data } = await api.post("/lists/", { client: clientId });
      set((s) => ({ lists: [...s.lists, data] }));
      return data as List;
    } catch {
      return null;
    }
  },

  deleteList: async (id) => {
    try {
      await api.delete(`/lists/${id}/`);
      set((s) => ({
        lists: s.lists.filter((l) => l.id !== id),
        activeList: s.activeList?.id === id ? null : s.activeList,
      }));
    } catch { /* noop */ }
  },

  setActiveList: (list) => set({ activeList: list }),

  loadOptions: async (listId) => {
    try {
      const { data } = await api.get(`/options/?list=${listId}`);
      set({ options: data });
    } catch { /* noop */ }
  },

  addOption: async (listId, payload) => {
    try {
      const { data } = await api.post("/options/", {
        ...payload,
        list: listId,
        property: Number(payload.property),
      });
      set((s) => ({ options: [...s.options, data] }));
    } catch { /* noop */ }
  },

  removeOption: async (optionId) => {
    try {
      await api.delete(`/options/${optionId}/`);
      set((s) => ({ options: s.options.filter((o) => o.id !== optionId) }));
    } catch { /* noop */ }
  },

  updateOption: async (optionId, payload) => {
    try {
      const { data } = await api.patch(`/options/${optionId}/`, {
        ...payload,
        ...(payload.property !== undefined && { property: Number(payload.property) }),
      });
      set((s) => ({ options: s.options.map((o) => (o.id === optionId ? data : o)) }));
    } catch { /* noop */ }
  },

  reorderOptions: async (optionId, direction) => {
    const { options, updateOption } = get();
    const sorted = [...options].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((o) => o.id === optionId);
    if (direction === "up" && idx > 0) {
      await updateOption(optionId, { order: sorted[idx - 1].order });
      await updateOption(sorted[idx - 1].id, { order: sorted[idx].order });
    } else if (direction === "down" && idx < sorted.length - 1) {
      await updateOption(optionId, { order: sorted[idx + 1].order });
      await updateOption(sorted[idx + 1].id, { order: sorted[idx].order });
    }
  },
}));
