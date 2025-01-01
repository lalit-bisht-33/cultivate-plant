import mongoose from "mongoose";
import Plant from "../models/Plant.model.js";

export const addNewPlant=async(req,res)=>{
const {name,wateringSchedule,sunlightNeeds,soilPreferences}=req.body;

try {
    if(!name || !wateringSchedule || !sunlightNeeds || !soilPreferences){
        return res.status(400).json({message:"Please enter all fields!!"})
    }
    
    const allowedSunlightNeeds=Plant.schema.path("sunlightNeeds").enumValues;
    const allowedSoilPreferences=Plant.schema.path("soilPreferences").enumValues;
    
    if(!allowedSunlightNeeds.includes(sunlightNeeds)){
        return res.status(400).json({
            message:`Invalid SunlightNeeds value.  Allowed values are ${allowedSunlightNeeds.join(",")} `
        })  
    }
    
    if(!allowedSoilPreferences.includes(soilPreferences)){
        return res.status(400).json({
            message:`Invalid SoilPreferences value.  Allowed values are 
             ${allowedSoilPreferences.join(",")} `
        })  
    }
    
    const newPlant=new Plant({
        name,
        wateringSchedule,
        sunlightNeeds,
        soilPreferences,
    })
    
    await newPlant.save();
    
    res.status(200).json({
        message: "New plant is created.",
        newPlant:{
            name,
            wateringSchedule,
            sunlightNeeds,
            soilPreferences, 
        }});
    
} catch (error) {
    console.log("Error in newPlant",error.message);
    res.status(400).json({error:"Internal Server Error!!"});
}
}

export const getAllPlants=async(req,res)=>{

  try {
    const plants = await Plant.find();

    if (plants.length === 0) {
      return res.status(404).json({ message: 'No plants found.' });
    }

    res.status(200).json(plants);

  } catch (error) {
    console.log("Error in getAllPlants",error.message);
    res.status(400).json({error:"Internal Server Error!!"});
  }

}

export const getPlantById=async(req,res)=>{
    try {
        const {id}=req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: "Invalid plant ID." });
        }
    
        const plant = await Plant.findById(id);
    
        
        if (!plant) {
            return res.status(404).json({ message: "Plant not found." });
        }
      
        return res.status(200).json( plant );
    } catch (error) {
        console.error("Error in getPlantById:", error.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
}

export const updatePlant=async(req,res)=>{
    const { id } = req.params;
  const { name, wateringSchedule, sunlightNeeds, soilPreferences } = req.body;

  try {
    if (!name || !wateringSchedule || !sunlightNeeds || !soilPreferences) {
      return res.status(400).json({ message: 'Please provide all required fields!' });
    }

    const updatedPlant = await Plant.findByIdAndUpdate(
      id,
      {
        name,
        wateringSchedule,
        sunlightNeeds,
        soilPreferences,
      },
      { new: true } // Return the updated document
    );

    if (!updatedPlant) {
      return res.status(404).json({ message: 'Plant not found!' });
    }

    res.status(200).json({
      message: 'Plant updated successfully!',
      updatedPlant,
    });
  } catch (error) {
    console.log('Error in updatePlant', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const deletePlant = async (req, res) => {
    const { id } = req.params; 
  
    try {
      const plant = await Plant.findByIdAndDelete(id);
  
      if (!plant) {
        return res.status(404).json({ message: "Plant not found!" });
      }
  
      res.status(200).json({ message: "Plant deleted successfully!" });
  
    } catch (error) {
      console.log("Error in deletePlant", error.message);
      res.status(400).json({ error: "Internal Server Error!" });
    }
}

export const searchPlants = async (req, res) => {
    const { name } = req.query;

    try {
      if (!name) {
        return res.status(400).json({ message: 'Please provide a plant name to search.' });
      }

      const plants = await Plant.find({
        name: { $regex: name, $options: 'i' }, 
      });

      if (plants.length === 0) {
        return res.status(404).json({ message: 'No plants found with that name.' });
      }
  
      res.status(200).json(plants);
    } catch (error) {
      console.error('Error searching for plants:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getPlantsByCategory = async (req, res) => {
    const { category, categoryType } = req.query;
  
    try {
      if (!category || !categoryType) {
        return res.status(400).json({ message: 'Please provide both category and categoryType to search.' });
      }
  
      const validCategoryTypes = ['sunlightNeeds', 'soilPreferences', 'wateringSchedule'];
      if (!validCategoryTypes.includes(categoryType)) {
        return res.status(400).json({ message: 'Invalid categoryType.' });
      }
  
      const query = {};
      query[categoryType] = category; // For example, { sunlightNeeds: 'Full sun' }
  
      const plants = await Plant.find(query);
  
      if (plants.length === 0) {
        return res.status(404).json({ message: `No plants found for ${categoryType}: ${category}` });
      }
  
      res.status(200).json(plants);
  
    } catch (error) {
      console.error('Error searching for plants by category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
