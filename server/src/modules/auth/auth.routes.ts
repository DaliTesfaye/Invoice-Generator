import { Router } from "express";
import { register, login, logout, getMe, verifyEmail, forgotPassword, resetPassword } from "./auth.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
