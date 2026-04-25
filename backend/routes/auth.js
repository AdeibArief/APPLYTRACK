import express from "express";
import { getMe, login, register } from "../controller/authController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/getme", protect, getMe);

export default router ;
