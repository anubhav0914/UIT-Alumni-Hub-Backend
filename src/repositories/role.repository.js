import { prisma } from "../../lib/prisma";

export class RoleRepository {
  
  // CREATE
  async createRole(data) {
    return prisma.role.create({ data });
  }

  // READ: Find by name
  async findByName(name) {
    return prisma.role.findFirst({
      where: { name },
    });
  }

  // READ: Get all roles
  async getAllRoles() {
    return prisma.role.findMany();
  }

  // READ: Get role by ID (recommended for admin actions)
  async getRoleById(id) {
    return prisma.role.findUnique({
      where: { id },
    });
  }

  // UPDATE role by ID
  async updateRole(id, data) {
    return prisma.role.update({
      where: { id },
      data,
    });
  }

  // DELETE role by ID
  async deleteRole(id) {
    return prisma.role.delete({
      where: { id },
    });
  }
}
