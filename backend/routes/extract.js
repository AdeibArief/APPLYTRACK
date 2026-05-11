import express from "express";
import { protect } from "../middleware/protect.js";
import { bulkExtractJobs, extractJobInfo } from "../controller/extractController.js";

const router = express.Router();

router.post("/", protect, extractJobInfo);
router.post("/bulk", protect, bulkExtractJobs);

export default router