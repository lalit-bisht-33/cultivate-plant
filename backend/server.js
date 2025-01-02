import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import {connectDB} from "./config/db.js"
import UserRoute from "./routes/User.route.js"
import PlantRoute from "./controllers/Plant.controller.js"
import ReminderRoute from "./controllers/Reminder.controller.js"

dotenv.config();

const app=express();

//middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());


//Routes Handle
app.use('/api/user', UserRoute);
app.use('/api/plant',PlantRoute);
app.use('/api/reminder',ReminderRoute);


//listen to port 
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