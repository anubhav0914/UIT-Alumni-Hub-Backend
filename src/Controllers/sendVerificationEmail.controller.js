import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/sendEmail.js";
import { prisma } from "../prismaClient.js";

export const sendVerificationEmail = asyncHandler(async (req, res) => {
  const userId = parseInt(req.body.user_id, 10);

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found");

  // fetch latest OTP
  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      user_id: userId,
      purpose: "REGISTER",
      is_used: false,
      expires_at: { gt: new Date() },
    },
    orderBy: { created_at: "desc" },
  });

  if (!otpRecord) {
    throw new ApiError(400, "OTP not found or expired");
  }

  // console.log("sendEmail called with:", to, subject, text);
  
  await sendEmail({
     to: user.email,
    subject: "Verify your Alumni account",
    text: `Your verification OTP is: ${otpRecord.otp_code}`,
  });

  return res.status(200).json(
    new ApiResponse(200, {}, "Verification email sent")
  );
});
