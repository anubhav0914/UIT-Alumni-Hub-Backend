import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import otpRouter from "./router/otp.routes.js";

const app = express();

// CORS setup
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", // fallback to "*" if not set
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Static files
app.use(express.static("public"));

// Cookie parser
app.use(cookieParser());

// --- Routes Import ---
import userRouter from "./router/user.routes.js";

// --- Routes Declaration ---
app.use("/api/v1/users", userRouter);
app.use("/api/v1/otp", otpRouter);


// --- Auth Routes Import ---
import authRoutes from "./router/auth.routes.js";

// --- Auth Routes Declaration ---
app.use("/api/v1/auth", authRoutes);

// --- OTP Routes Import ---
import otpRoutes from "./router/otp.routes.js";

// --- OTP Routes Declaration ---
app.use("/api/v1/otp", otpRoutes);

// 
import emailRoutes from "./router/email.routes.js";

// --- Email Routes Declaration ---
app.use("/api/v1/email", emailRoutes);

// Auth routes (register / login / logout)
import autherRoutes from "./router/auther.routes.js";

app.use("/api/v1/auth", autherRoutes);


export { app };
