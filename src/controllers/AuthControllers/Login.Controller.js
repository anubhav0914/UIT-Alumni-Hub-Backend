import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../prismaClient.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    res.status(400);
    throw new ApiError(400, "Email and password are required");
  }

  // Find user in DB
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Compare password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Set token in cookie 
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });

  // Send response
  res.status(200).json({
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,  
      email: user.email,
      role: user.role,
    },
  });
});

export default loginUser;
