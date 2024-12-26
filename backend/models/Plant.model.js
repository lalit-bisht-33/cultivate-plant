import mongoose from "mongoose";

const PlantSchema= new mongoose.Schema({
name:{
    type:String,
    required:true,
},
wateringSchedule:{
    type:String,
    required:true,
},
sunlightNeeds:{
    type:String,
    enum: ['Full sun', 'Partial shade', 'Indirect light'],
    required:true,
},
soilPreferences:{
    type:String,
    enum: ['Well-drained', 'Loamy', 'Clay', 'Sandy', 'Peaty', 'Chalky'],
    required:true,
},
reminders:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reminder"
    }
],


},{timestamps:true})

const Plant = mongoose.model("Plant",PlantSchema);
export default Plant;