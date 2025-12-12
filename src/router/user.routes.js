import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();
// Simple demo route using asyncHandler
router.get(
  "/test",
  asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      message: "Router working successfully!",
    });
  })
);

export default router;