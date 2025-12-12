import { prisma } from "../../lib/prisma";

export class UserRepository {
  async createUser(data) {
    return prisma.user.create({ data });
  }

  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUser(id, data) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id) {
    return prisma.user.delete({
      where: { id },
    });
  }
}
