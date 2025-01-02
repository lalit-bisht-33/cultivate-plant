import mongoose from "mongoose";
import Reminder from "../models/Reminder.model.js";
import Plant from "../models/Plant.model.js";

export const getReminder = async(req,res)=>{
    try {
        const userId = req.user._id;
    
        const reminders = await Reminder.find({ user: userId })
        .populate('plant', 'name')
        .populate('user').select("-password");
    
        if (reminders.length === 0) {
          return res.status(404).json({ message: 'No reminders found for this user.' });
        }
    
        res.status(200).json(reminders);
      } catch (error) {
        console.error('Error fetching reminders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

export const createReminder = async (req, res) => {
    const { type, dueDate, frequency, message, plant } = req.body;
  
    try {
    const plantExists = await Plant.findOne({ _id: plant, user: req.user._id });

  
      if (!plantExists) {
        return res.status(404).json({ message: 'Plant not found. Please select a valid plant.' });
      }
  
      const newReminder = new Reminder({
        type,
        dueDate,
        frequency,
        message,
        plant,
        user: req.user._id, 
      });
  
      const savedReminder = await newReminder.save();
  
      res.status(201).json(savedReminder);
    } catch (error) {
      console.error('Error creating reminder:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const updateReminderStatus = async (req, res) => {
    const { id } = req.params; 
    const { status } = req.body; 

    try {
      const validStatuses = Reminder.schema.path('status').enumValues;
  
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
      }
  
      const reminder = await Reminder.findOne({ _id: id, user: req.user._id });
      //2 parameter use so specify for log in user
      if (!reminder) {
        return res.status(404).json({ message: 'Reminder not found.' });
      }
  
      reminder.status = status;
      const updatedReminder = await reminder.save();
  
      res.status(200).json(updatedReminder);
    } catch (error) {
      console.error('Error updating reminder status:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const deleteReminder = async (req, res) => {
  const { id } = req.params;

  try {
   
    const reminder = await Reminder.findOneAndDelete({ _id: id, user: req.user._id });
   
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found or unauthorized to delete.' });
    }

    res.status(200).json({ message: 'Reminder deleted successfully.' }); 
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ message: 'Internal Server Error' }); 
  }
};
