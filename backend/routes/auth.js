import express from "express";
import {
  getMe,
  login,
  logout,
  register,
} from "../controller/authController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/getme", protect, getMe);

router.post("/logout", protect, logout);

export default router;
