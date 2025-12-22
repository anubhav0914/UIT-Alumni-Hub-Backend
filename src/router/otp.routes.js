import {Router} from "express";
import {generateOtpController} from "../controllers/otp.controller.js";
// import { sendVerificationEmail } from "../controllers/auth.controller.js";

// const router = express.Router();
const router = Router();

router.route("/generate-otp").post(generateOtpController);

// router.route("/send-verification-email").post(sendVerificationEmail);

export default router;