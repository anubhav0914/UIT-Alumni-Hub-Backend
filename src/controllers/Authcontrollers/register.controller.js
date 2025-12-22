import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma.js";
import  ApiError  from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // validation
  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // check existing user
  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    throw new ApiError(409, "User already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "STUDENT",
    },
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
});