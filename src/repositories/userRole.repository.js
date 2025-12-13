import { prisma } from "../prismaClient.js";

export class UserRoleRepository {

  // CREATE: assign a role to a user
  async assignRole(userId, roleId) {
    return prisma.userRoles.create({
      data: {
        user_id: userId,
        role_id: roleId,
      },
    });
  }

  // READ: get all roles assigned to a specific user
  async getUserRoles(userId) {
    return prisma.userRoles.findMany({
      where: { user_id: userId },
      include: {
        role: true,
      },
    });
  }

  // READ: get all users who have a specific role
  async getUsersByRole(roleId) {
    return prisma.userRoles.findMany({
      where: { role_id: roleId },
      include: {
        user: true,
      },
    });
  }

  // DELETE: remove a role from a user
  async removeRole(userId, roleId) {
    return prisma.userRoles.delete({
      where: {
        user_id_role_id: { user_id: userId, role_id: roleId },
      },
    });
  }

  // UPDATE: (optional) update assigned_at timestamp
  async updateAssignedAt(userId, roleId, newDate) {
    return prisma.userRoles.update({
      where: {
        user_id_role_id: { user_id: userId, role_id: roleId },
      },
      data: {
        assigned_at: newDate,
      },
    });
  }
}

export default new UserRoleRepository();
