import express from "express";
import { protect } from "../middleware/protect.js";
import {
  addJob,
  bulkAddJobs,
  deleteJob,
  getAllJobs,
  updateJob,
} from "../controller/JobController.js";

const router = express.Router();

router.get("/getalljobs", protect, getAllJobs);
router.post("/addjob", protect, addJob);

router.put("/updatejob/:id", protect, updateJob);
router.delete("/deletejob/:id", protect, deleteJob);
router.post("/bulkimport", protect, bulkAddJobs);

export default router;
