import { prisma } from "../prismaClient.js";

export class LoginAttemptRepository {

  // CREATE: Log a new login attempt
  async logAttempt(data) {
    return prisma.loginAttempt.create({
      data,
    });
  }

  // READ: Get single attempt by ID
  async getAttemptById(id) {
    return prisma.loginAttempt.findUnique({
      where: { id },
    });
  }

  // READ: Get all attempts for a user
  async getAttemptsByUser(userId) {
    return prisma.loginAttempt.findMany({
      where: { user_id: userId },
      orderBy: { attempted_at: "desc" },
    });
  }

  // READ: Get attempts by email (useful for unregistered login attempts)
  async getAttemptsByEmail(email) {
    return prisma.loginAttempt.findMany({
      where: { email },
      orderBy: { attempted_at: "desc" },
    });
  }

  // DELETE: Remove one specific attempt
  async deleteAttempt(id) {
    return prisma.loginAttempt.delete({
      where: { id },
    });
  }

  // DELETE: Clear all attempts for a user (admin or security action)
  async deleteAttemptsForUser(userId) {
    return prisma.loginAttempt.deleteMany({
      where: { user_id: userId },
    });
  }

  // DELETE: Remove failed attempts (optional)
  async deleteFailedAttempts(userId) {
    return prisma.loginAttempt.deleteMany({
      where: {
        user_id: userId,
        status: "FAILED",
      },
    });
  }

  // DELETE: Cleanup old attempts (e.g., older than X days)
  async deleteOldAttempts(days = 30) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return prisma.loginAttempt.deleteMany({
      where: {
        attempted_at: { lt: cutoff },
      },
    });
  }
}

export default new LoginAttemptRepository();