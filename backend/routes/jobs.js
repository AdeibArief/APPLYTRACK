import express from "express";
import { protect } from "../middleware/protect.js";
import {
  addJob,
  deleteJob,
  getAllJobs,
  updateJob,
} from "../controller/JobController.js";

const router = express.Router();

router.get("/getalljobs", protect, getAllJobs);
router.post("/addjob", protect, addJob);

router.put("/updatejob/:id", protect, updateJob);
router.delete("/deletejob/:id", protect, deleteJob);

export default router;
