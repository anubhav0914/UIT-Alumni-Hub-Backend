import { prisma } from "../prismaClient.js";

export class OtpRepository {

  // CREATE: Generate new OTP
  async createOtp(data) {
    return prisma.otpCode.create({
      data,
    });
  }

  // READ: Get OTP by ID
  async getOtpById(id) {
    return prisma.otpCode.findUnique({
      where: { id },
    });
  }

  // READ: Find a valid (not used, not expired) OTP
  async findValidOtp(userId, purpose) {
    return prisma.otpCode.findFirst({
      where: {
        user_id: userId,
        purpose,
        is_used: false,
        expires_at: { gt: new Date() }, // not expired
      },
    });
  }

  // UPDATE: Mark OTP as used
  async invalidateOtp(id) {
    return prisma.otpCode.update({
      where: { id },
      data: { is_used: true },
    });
  }

  // DELETE: Remove OTP by ID
  async deleteOtp(id) {
    return prisma.otpCode.delete({
      where: { id },
    });
  }

  // DELETE MANY: Remove all expired OTPs
  async deleteExpiredOtps() {
    return prisma.otpCode.deleteMany({
      where: {
        expires_at: { lt: new Date() },
      },
    });
  }
}

export default new OtpRepository();