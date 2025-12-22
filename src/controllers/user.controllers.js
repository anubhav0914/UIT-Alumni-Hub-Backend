import asyncHandler from "../utils/asyncHandler.js";
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import  userRepository  from "../repositories/user.repository.js";

export const getUserById = asyncHandler(async (req, res)=>{

    const id = parseInt(req.params.id, 10);

    if(!id) {
        throw new ApiError(400, "User Id is required");
    }

    const user = await userRepository.findById(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const { password_hash: _, ...userData } = user;

    return res.status(200).json(
        new ApiResponse(200, userData, "User fetched successfully")
    ); 
});



export const getUserByEmail = asyncHandler(async (req,res) => {

    const { email } = req.params;

    if(!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await userRepository.findByEmail(email);

    if(!user) {
        throw new ApiError(404, "User not found");
    }

    const { password_hash: _, ...userData } = user;

    return res.status(200).json(
        new ApiResponse(200, userData, "User fetched successfully")
    );
});

export const updateUser = asyncHandler(async (req,res) => {

    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const { full_name, email, phone, is_verified } = req.body;
    
    // At least one field must be provided
    if (
        full_name === undefined &&
        email === undefined &&
        phone === undefined &&
        is_verified === undefined
    ) {
    throw new ApiError(400, "At least one field is required to update");
    }

    // Check if user exists
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
        throw new ApiError(404, "User not found");
    }

    let updatedUser;

    try{
        updatedUser = await userRepository.updateUser(id, {
        full_name,
        email,
        phone,
        is_verified,
    })
    }   catch (error) {
        if (error.code === "P2002") {
        throw new ApiError(409, "Email already exists");
    }
        throw error;
    }

    // Remove sensitive fields
    const { password_hash: _, ...userData } = updatedUser;

    return res.status(200).json(
        new ApiResponse(200, userData, "User updated successfully")
    );
});
