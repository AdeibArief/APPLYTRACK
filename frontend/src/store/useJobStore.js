import { create } from "zustand";
import api from "../lib/api";

const useJobStore = create((set) => ({
  jobs: [],
  isLoading: false,
  error: null,

  getAllJobs: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("api/jobs/getalljobs");
      const sorted = res.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      set({ jobs: sorted});
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addJob: async (company, role, status, source, jobUrl, notes) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("api/jobs/addjob", {
        company,
        role,
        status,
        source,
        jobUrl,
        notes,
      });

      set((state) => ({
        jobs: [...state.jobs, res.data.data],
      }));
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateJob: async (id, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put(`/api/jobs/updatejob/${id}`, updatedData);

      set((state) => ({
        jobs: state.jobs.map((job) => (job._id === id ? res.data.data : job)),
      }));
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteJob: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/api/jobs/deletejob/${id}`);
      set((state) => ({ jobs: state.jobs.filter((job) => job._id !== id) }));
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useJobStore;
