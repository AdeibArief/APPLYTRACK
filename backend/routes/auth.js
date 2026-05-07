import express from "express";
import {
  getMe,
  login,
  logout,
  register,
  forgotPassword,
  resetPassword,
} from "../controller/authController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/getme", protect, getMe);

router.post("/logout", protect, logout);

router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:token", resetPassword);

export default router;
