import { create } from "zustand";
import api from "../lib/api";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
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
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/api/auth/getme");
      set({ user: res.data.data, token: true });
    } catch (error) {
      set({user:null,token:null});
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.log(error.message);
    } finally {
      set({ user: null, token: null });
    }
  },
}));

export default useAuthStore;
