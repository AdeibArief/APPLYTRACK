import { create } from "zustand";
import api from "../lib/api";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isLoading: false,
  error: null,

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      set({ user: res.data.data, token: res.data.data.token });
      localStorage.setItem("token", res.data.data.token);
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/api/auth/login", { email, password });
      set({ user: res.data.data, token: res.data.data.token });
      localStorage.setItem("token", res.data.data.token);
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ user: null, token: null });
    localStorage.removeItem("token");
  },
}));

export default useAuthStore;
