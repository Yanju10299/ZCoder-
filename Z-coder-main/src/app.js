import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

const app=express();
app.set("trust proxy",1);
app.use(cors({origin: ['http://127.0.0.1:5500', 'https://localhost:5500'], // List all allowed origins
methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
credentials: true, // Enable credentials for cross-origin requests
allowedHeaders: 'Content-Type, Authorization',}));                           //change settings to allow request from front end

app.use(express.urlencoded({extended : true, limit: "20Kb"}));
app.use(express.json({limit: "20kb"}));
app.use(express.static("Public"));
app.use(cookieParser());


// Routes import

import userRouter from "./Routes/user.routes.js"

app.use("/users",userRouter);
export default app;