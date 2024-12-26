import express from "express";
import { register,login,getUserProfile,updateUserProfile,deleteUserProfile,logout} from "../controllers/User.controller.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";

const router=express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout",logout);
router.get("/profile/:id",protectRoute,getUserProfile);
router.post("/update",protectRoute,updateUserProfile);
router.delete("/delete",protectRoute,deleteUserProfile);
router.delete("/delete",protectRoute,deleteUserProfile);


export default router;