import express from "express";
import { addNewPlant,getAllPlants,getPlantById,updatePlant, deletePlant, searchPlants, getPlantsByCategory } from "../controllers/Plant.controller.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";

const router=express.Router();

router.post('/add',protectRoute,addNewPlant);
router.get('/',getAllPlants);
router.get('/:id',protectRoute,getPlantById);
router.patch('/:id',protectRoute,updatePlant);
router.delete('/:id',protectRoute,deletePlant);
router.get('/search',searchPlants); //use automatic
router.get('/category', getPlantsByCategory);

export default router;