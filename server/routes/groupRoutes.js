import { Router } from "express";
import { createGroup } from "../controllers/groupController.js";
import authUser from "../middlewares/authMiddleware.js";
import { getUserGroups } from "../controllers/groupController.js";

const router = Router();

// Create a Group
router.post("/create-group", authUser, createGroup);

// Get User Groups
router.get("/get-user-groups", authUser, getUserGroups);


export default router;
