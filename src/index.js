// require('dotenv').config({ path: './.env' });
import dotenv from "dotenv"
import mongoose from "mongoose";

import { DB_NAME } from "./constants.js";

import connectDB from "./db/index.js";

import express from "express";

const app = express()

dotenv.config({
    path:"./.env"
})

/*
( async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",()=>{
            console.log("ERROR: ",error);
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`APP is listening on ${PORT}`)
        })
    } catch(error){
        console.error("ERROR:",error)
        throw error
    }
})()

*/
connectDB()