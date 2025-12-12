import { prisma } from "../../lib/prisma.js";

export class PasswordResetRepository {
  
  // CREATE: Generate a new password reset token
  async createResetToken(data) {
    return prisma.passwordReset.create({
      data,
    });
  }

  // READ: Get reset token by ID
  async getResetTokenById(id) {
    return prisma.passwordReset.findUnique({
      where: { id },
    });
  }

  // READ: Find a valid reset token for a user (not used + not expired)
  async findValidToken(userId, tokenHash) {
    return prisma.passwordReset.findFirst({
      where: {
        user_id: userId,
        token_hash: tokenHash,
        is_used: false,
        expires_at: { gt: new Date() },
      },
    });
  }

  // UPDATE: Mark token as used after successful password reset
  async markTokenAsUsed(id) {
    return prisma.passwordReset.update({
      where: { id },
      data: { is_used: true },
    });
  }

  // DELETE: Remove a specific reset token
  async deleteToken(id) {
    return prisma.passwordReset.delete({
      where: { id },
    });
  }

  // DELETE MANY: Remove all expired reset tokens
  async deleteExpiredTokens() {
    return prisma.passwordReset.deleteMany({
      where: {
        expires_at: { lt: new Date() },
      },
    });
  }
}
