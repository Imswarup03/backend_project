import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import fs from "fs"

// Method 
const registerUser= asyncHandler (async(req,res,)=>{
    try{
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

    // if (fullName ===""){
    //     throw new ApiError(400,"Full Name is required")
    // } this one is simple method

    if (
        [fullName,email,userName,password].some((field) => field?.trim() ==="")
        
    ){
        // const avatarLocalPath= req.files?.avatar?.[0]?.path
        // if (avatarLocalPath) fs.unlinkSync(avatarLocalPath)
        // let coverImageLocalPath;
        // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        //     coverImageLocalPath = req.files.coverImage[0].path
        //     fs.unlinkSync(coverImageLocalPath)
        // }
        throw new ApiError(400,"All fields are required")
    }
    
    const existedUser= await User.findOne({
        $or:[ {userName}, {email} ]
    })
    if (existedUser){

        throw new ApiError(409,"Username with name already exists")
    }
    else{
        
        const avatarLocalPath= req.files?.avatar?.[0]?.path
        
        let coverImageLocalPath;
        if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
            coverImageLocalPath = req.files.coverImage[0].path
        }
        console.log("coverImageLocalPath",coverImageLocalPath)



        if (!avatarLocalPath && (!coverImageLocalPath || coverImageLocalPath)){

            // if (coverImageLocalPath) fs.unlinkSync(coverImageLocalPath) 

            throw new ApiError(400,"Avatar is required")
        }
        const avatar = await uploadOnCloudinary(avatarLocalPath)

        const coverImage = await uploadOnCloudinary (coverImageLocalPath)

        // console.log("avatar",avatar)
        // console.log('coverImage',coverImage)

        if (!avatar){
            throw new ApiError(400,"Avatar file is required ")

        }
        
        const user = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            userName:userName.toLowerCase()
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

    }
    }catch(error){
        const avatarLocalPath= req.files?.avatar?.[0]?.path
        console.log("avatarLocalPath",avatarLocalPath)
        if(avatarLocalPath) fs.unlinkSync(avatarLocalPath)
        const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
        if (coverImageLocalPath) fs.unlinkSync(coverImageLocalPath)
        throw new ApiError(error.statusCode,error.message)
    }

})




export {registerUser} 
