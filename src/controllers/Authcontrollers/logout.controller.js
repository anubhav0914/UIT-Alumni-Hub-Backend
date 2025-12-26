import  asyncHandler  from "../../utils/asyncHandler.js";

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false, 
    sameSite: "lax",
  });

  res.status(200).json({
    message: "Logout successful",
  });
});