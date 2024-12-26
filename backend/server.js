import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js"
dotenv.config();

const app=express();

app.get("/",(req,res)=>{
    res.send("Server is running!!");
})

const PORT=process.env.PORT || 5000;
app.listen(PORT,(req,res)=>{
    connectDB();
    console.log(`Server is running on port: http://localhost:${PORT}`);
    
})


//git remote add origin git@github.com:lalit-bisht-33/cultivate-plant.git
// git branch -M main
// git push -u origin main