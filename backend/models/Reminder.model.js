import mongoose from "mongoose";

const ReminderSchema= new mongoose.Schema({
    type: {
        type: String,
        enum: ['Watering', 'Fertilizing', 'Pruning', 'General Care'],
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    frequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly'],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending',
    },
    plant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plant",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Reference to the User model
        required: true,
    }


},{timestamps:true})

const Reminder = mongoose.model("Reminder",ReminderSchema);
export default Reminder;