import bcrypt from "bcrypt";
import prisma from "../../prismaClient.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";

const ALLOWED_ROLES = ["ADMIN", "STUDENT", "ALUMNI"];

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  //  Basic validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  //  Role validation
  if (role && !ALLOWED_ROLES.includes(role)) {
   
    throw new ApiError(400,"Invalid role");
  }

  //  Existing user check
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (existingUser) {
    
    throw new ApiError(409,"User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "STUDENT",
    },
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export default registerUser;
