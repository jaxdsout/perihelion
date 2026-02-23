import axios from "axios";
import { create } from "zustand";
import api from "../../globals/api";
import type { AuthState, LoginPayload, SignupPayload } from "./types";

const API_URL = import.meta.env.VITE_API_URL as string;

function clearMessage(set: (partial: Partial<AuthState>) => void) {
  setTimeout(() => set({ message: null, error: null }), 3000);
}

export const useAuthStore = create<
  AuthState & {
    login: (payload: LoginPayload) => Promise<void>;
    logout: () => void;
    signup: (payload: SignupPayload) => Promise<void>;
    activate: (uid: string, token: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    confirmPassword: (uid: string, token: string, new_password: string, re_new_password: string) => Promise<void>;
    loadUser: () => Promise<void>;
    authUser: () => Promise<void>;
  }
>((set, get) => ({
  access: localStorage.getItem("access"),
  refresh: localStorage.getItem("refresh"),
  isAuthenticated: !!localStorage.getItem("access"),
  user: null,
  loading: false,
  message: null,
  error: null,
  signupSuccess: false,
  resetSuccess: false,
  activateSuccess: false,
  activateFail: false,

  login: async ({ email, password }) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(`${API_URL}/jwt/create/`, { email, password });
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      set({ access: data.access, refresh: data.refresh, isAuthenticated: true, loading: false });
      await get().loadUser();
    } catch {
      set({ error: "Invalid credentials.", loading: false });
      clearMessage(set);
    }
  },

  logout: () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    set({
      access: null,
      refresh: null,
      isAuthenticated: false,
      user: null,
      message: "You have been logged out.",
    });
    clearMessage(set);
  },

  signup: async (payload) => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${API_URL}/users/`, payload);
      set({ signupSuccess: true, loading: false, message: "Account created! Check your email to activate." });
      clearMessage(set);
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data
          ? Object.values(err.response.data).flat().join(" ")
          : "Signup failed.";
      set({ error: String(msg), loading: false });
      clearMessage(set);
    }
  },

  activate: async (uid, token) => {
    set({ loading: true });
    try {
      await axios.post(`${API_URL}/users/activation/`, { uid, token });
      set({ activateSuccess: true, loading: false, message: "Account activated! You can now log in." });
      clearMessage(set);
    } catch {
      set({ activateFail: true, loading: false, error: "Activation failed. The link may have expired." });
      clearMessage(set);
    }
  },

  resetPassword: async (email) => {
    set({ loading: true });
    try {
      await axios.post(`${API_URL}/users/reset_password/`, { email });
      set({ resetSuccess: true, loading: false, message: "Password reset email sent!" });
      clearMessage(set);
    } catch {
      set({ error: "Failed to send reset email.", loading: false });
      clearMessage(set);
    }
  },

  confirmPassword: async (uid, token, new_password, re_new_password) => {
    set({ loading: true });
    try {
      await axios.post(`${API_URL}/users/reset_password_confirm/`, {
        uid,
        token,
        new_password,
        re_new_password,
      });
      set({ loading: false, message: "Password updated! You can now log in." });
      clearMessage(set);
    } catch {
      set({ error: "Password reset failed. The link may have expired.", loading: false });
      clearMessage(set);
    }
  },

  loadUser: async () => {
    try {
      const { data } = await api.get(`/users/me/`);
      set({ user: data });
    } catch {
      set({ user: null });
    }
  },

  authUser: async () => {
    const access = localStorage.getItem("access");
    if (!access) {
      set({ isAuthenticated: false });
      return;
    }
    try {
      await axios.post(`${API_URL}/jwt/verify/`, { token: access });
      set({ isAuthenticated: true });
      if (!get().user) await get().loadUser();
    } catch {
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_URL}/jwt/refresh/`, { refresh });
          localStorage.setItem("access", data.access);
          set({ access: data.access, isAuthenticated: true });
          if (!get().user) await get().loadUser();
        } catch {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          set({ isAuthenticated: false, access: null, refresh: null });
        }
      } else {
        set({ isAuthenticated: false });
      }
    }
  },
}));
