import { prisma } from "../prismaClient.js";
import { generateOtp } from "../utils/generateOtp.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const generateOtpController = asyncHandler(async (req, res) => {
    const { user_id, purpose } = req.body;
    const userId = parseInt(user_id, 10);

    if (!user_id || !purpose) {
      throw new ApiError(400, "User ID and purpose are required");
    }

    // check user Exxists
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await prisma.otpCode.updateMany({
      where: {
        user_id: userId,
        purpose,
        is_used: false,
      },
      data: {
        is_used: true,
      },
    });

    // generate new OTP
    const otp = generateOtp();

    // save OTP
    await prisma.otpCode.create({
      data: {
        user_id: userId,
        purpose,
        otp_code: otp,
        expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 min
      },
    });

    return res.status(200).json(
      new ApiResponse(200, { }, "OTP generated successfully"),
    );
});