import { prisma } from "../prismaClient.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * Get users by role
 * Roles: ADMIN | STUDENT | ALUMNI
 * Query param: ?role=ADMIN
 */
export const getUsersByRole = asyncHandler(async (req, res) => {
    const { role } = req.query;

    // Validate role
    const allowedRoles = ["ADMIN", "STUDENT", "ALUMNI"];
    const roleUpper = role?.toString().toUpperCase();
    if (!role || !allowedRoles.includes(roleUpper)) {
      return res.status(400).json({ message: "Invalid role. Use ADMIN, STUDENT or ALUMNI." });
    }

    // Fetch users with the specified role
    const users = await prisma.user.findMany({
      where: {
        roles: {
          some: {
            role: {
              slug: roleUpper,
            },
          },
        },
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        roles: {
          select: {
            role: {
              select: {
                slug: true
              },
            },
          },
        },
        created_at: true
      }
    });

    // Convert BigInt (id) and DateTime to string
    const usersSafe = users.map(user => ({
      ...user,
      id: user.id.toString(),
      created_at: user.created_at.toISOString()
    }));

    return res.status(200)
        .json(new ApiResponse(true, `${roleUpper} users fetched successfully`, usersSafe));
});
