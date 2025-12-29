import bcrypt from "bcrypt";
// import { prisma } from "../../../lib/prisma.js";
import { prisma } from "../../prismaClient.js";
import  ApiError  from "../../utils/ApiError.js";
import  asyncHandler  from "../../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { full_name, email, password, role } = req.body;

  // validation
  if (!full_name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const studentRole = await prisma.role.findFirst({
    where: { name: "STUDENT" },
  });

  if (!studentRole) {
    throw new ApiError(500, "STUDENT role not found");
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
      full_name,
      email,
      password_hash: hashedPassword,
      // roles: role || "STUDENT",
      roles: {
        create: {
          role: {
            connect: { id: 1 },
          },
        },
      },
    },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
    
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user.id,
      email: user.email,
      roles: user.roles.map(r => r.role.name),
    },
  });
});