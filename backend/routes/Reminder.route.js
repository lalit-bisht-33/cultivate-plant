import express from "express";
import { createReminder, deleteReminder, getReminder, updateReminderStatus } from "../controllers/Reminder.controller.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";

const router=express.Router();

router.get("/",protectRoute,getReminder);
router.post("/create",protectRoute,createReminder);
router.put('/:id/status', protectRoute, updateReminderStatus);
router.delete('/:id', protectRoute, deleteReminder);
export default router;