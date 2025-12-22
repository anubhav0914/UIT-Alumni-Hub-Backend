import express from "express";
import { verifyEmailOtp } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/verify-email", verifyEmailOtp);

export default router;
