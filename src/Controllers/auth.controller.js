import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { prisma } from "../prismaClient.js";

export const verifyEmailOtp = asyncHandler(async (req, res) => {
  const userId = parseInt(req.body.user_id, 10);
  const { otp } = req.body;


  // 1️ Validate input
  if (!userId || !otp) {
    throw new ApiError(400, "User ID and OTP are required");
  }

  // 2 Find valid OTP
  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      user_id: userId,
      otp_code: otp,
      purpose: "REGISTER",
      is_used: false,
      expires_at: { gt: new Date() },
    },
  });

  if (!otpRecord) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // 3️ Mark user as verified
  await prisma.user.update({
    where: { id: userId },
    data: { is_verified: true },
  });

  // 4️ Invalidate OTP
  await prisma.otpCode.update({
    where: { id: otpRecord.id },
    data: { is_used: true },
  });

  return res.status(200).json(
    new ApiResponse(200, {}, "Email verified successfully")
  );
});
