import { prisma } from "../prismaClient.js";
import { generateOtp } from "../utils/generateOtp.js";

export const generateOtpController = async (req, res) => {
  try {
    const { user_id, purpose } = req.body;

    if (!user_id || !purpose) {
      return res.status(400).json({
        success: false,
        message: "user_id and purpose are required",
      });
    }

    await prisma.otpCode.updateMany({
      where: {
        user_id,
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
        user_id,
        otp_code: otp,
        purpose,
        expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 min
      },
    });

    return res.status(200).json({
      success: true,
      message: "OTP generated successfully",
    });
  } catch (error) {
    console.error("OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "OTP generation failed",
    });
  }
};
