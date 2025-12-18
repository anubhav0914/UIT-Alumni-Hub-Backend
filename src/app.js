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


export { app };