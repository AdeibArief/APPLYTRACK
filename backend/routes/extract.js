import express from "express";
import { protect } from "../middleware/protect.js";
import { extractJobInfo } from "../controller/extractController.js";

const router = express.Router();

router.post("/", protect, extractJobInfo);


export default router