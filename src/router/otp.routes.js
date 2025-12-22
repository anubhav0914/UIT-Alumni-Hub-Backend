import express from "express";
import { generateOtpController } from "../controllers/otp.controller.js";

const router = express.Router();

router.post("/generate", generateOtpController);

export default router;