import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit:"16kb"
}))
app.use(express.urlencoded({extended:true,limit:"16kb"}));

app.use(express.static("public"));

app.use(cookieParser())

// routes import 

import userRouter from './routes/user.routes.js';

// console.log(userRouter)


// routes declaration 

app.use("/api/v1/users",userRouter); // it will work as a prefix in the url






export { app }