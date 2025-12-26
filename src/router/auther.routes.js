import { Router } from "express";
import { registerUser } from "../controllers/Authcontrollers/register.controller.js";
import { loginUser } from "../controllers/Authcontrollers/login.controller.js";
import { logoutUser } from "../controllers/Authcontrollers/logout.controller.js";

const router = Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Logout user
router.post("/logout", logoutUser);

export default router;
