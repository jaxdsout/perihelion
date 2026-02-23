import { create } from "zustand";
import api from "../../globals/api";

export interface Task {
  id: number;
  agent: number;
  body: string;
  due_date: string;
  is_complete: boolean;
}

export interface UpcomingDeal {
  id: number;
  client_name: string;
  prop_name: string;
  move_date: string;
  commission: string;
}

interface DashboardState {
  tasks: Task[];
  upcoming: UpcomingDeal[];
  loading: boolean;
  loadDashboard: () => Promise<void>;
  toggleTask: (id: number, is_complete: boolean) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  createTask: (body: string, due_date: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  tasks: [],
  upcoming: [],
  loading: false,

  loadDashboard: async () => {
    set({ loading: true });
    try {
      const [tasksRes, dealsRes] = await Promise.all([
        api.get("/tasks/"),
        api.get("/deals/"),
      ]);
      const today = new Date().toISOString().slice(0, 10);
      const upcoming: UpcomingDeal[] = (dealsRes.data as UpcomingDeal[]).filter(
        (d) => d.move_date >= today
      );
      set({ tasks: tasksRes.data, upcoming, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  toggleTask: async (id, is_complete) => {
    try {
      await api.patch(`/tasks/${id}/`, { is_complete: !is_complete });
      set((s) => ({
        tasks: s.tasks.map((t) => (t.id === id ? { ...t, is_complete: !is_complete } : t)),
      }));
    } catch { /* noop */ }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}/`);
      set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
    } catch { /* noop */ }
  },

  createTask: async (body, due_date) => {
    try {
      const { data } = await api.post("/tasks/", { body, due_date });
      set((s) => ({ tasks: [...s.tasks, data] }));
    } catch { /* noop */ }
  },
}));

// Re-export agent-wide store for other features to use
export { useDashboardStore as useAgentStore };
