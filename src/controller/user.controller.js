import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

// Method 
const registerUser= asyncHandler (async(req,res,)=>{
    // get user details from frontend
    // validation-not empty
    // check if user already exists: check with username and email
    // check for images,check for avatar
    // upload them to cloudinary, avatar
    // create user object: because mongodb is NOsql - create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return response 
    const {userName,email,fullName,password}=req.body
    console.log('email:',email);

    // if (fullName ===""){
    //     throw new ApiError(400,"Full Name is required")
    // } this one is simple method

    if (
        [fullName,email,userName,password].some((field) => field?.trim() ==="")
        
    ){
        throw new ApiError(400,"All fields are required")
    }
    
    const existedUser= User.findOne({
        $or:[ {userName}, {email} ]
    })
    if (existedUser){
        throw new ApiError(409,"Username with name already exists")
    }
    const avatarLocalPath= req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    const coverImage = await uploadOnCloudinary (coverImageLocalPath)

    if (!avatar){
        throw new ApiError(400,"Avatar file is required ")
    }
    
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName:userName.tolowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser){
        throw new ApiError(500,"Something went wrong while creating user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User created successfully")
    )

})




export {registerUser} 