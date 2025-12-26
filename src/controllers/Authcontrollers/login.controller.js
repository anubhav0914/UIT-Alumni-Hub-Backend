import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../prismaClient.js";
import  ApiError  from "../../utils/ApiError.js";
import  asyncHandler  from "../../utils/asyncHandler.js";

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    throw new ApiError(400, "Email and password required");
  }

  // check user
  const user = await prisma.user.findUnique({
    where: { email },
     include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // compare password
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  const roles = user.roles.map(r => r.role.name);

  // generate token
  const token = jwt.sign(
    { userId: user.id, roles },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // set cookie
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: false, 
    sameSite: "lax",
  });

  res.status(200).json({
    message: "Login successful",
    token,
  });
});