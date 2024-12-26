import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connectDB=async ()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGODB_CONN);
        console.log(`mongoDB is connected ${conn.connection.host}`);
    } catch (error) {
        console.log("Error in connecting mongoDB");
        process.exit(1);
        
    }
    
}