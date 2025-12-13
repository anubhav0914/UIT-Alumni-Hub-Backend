import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import {getUserById, getUserByEmail, updateUser} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

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

router.route("/email/:email").get(verifyJWT, getUserByEmail);
router.route("/:id").get(verifyJWT, getUserById);
router.route("/:id").patch(verifyJWT, updateUser);

export default router;