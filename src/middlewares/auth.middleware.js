import { prisma } from "../../lib/prisma";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Verify JWT
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB using Prisma
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id },
      select: { id: true, full_name: true, email: true, primaryRole: { select: { id: true, slug: true } } },
    });

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
