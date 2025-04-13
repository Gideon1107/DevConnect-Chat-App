import { Router } from "express";
import { createGroup } from "../controllers/groupController.js";
import authUser from "../middlewares/authMiddleware.js";
import { getUserGroups, getGroupMembers, getGroupAdmin, editGroup, deleteGroup } from "../controllers/groupController.js";

const router = Router();

// Create a Group
router.post("/create-group", authUser, createGroup);

// Get User Groups
router.get("/get-user-groups", authUser, getUserGroups);

// Get Group Members  
router.get("/get-group-members", authUser, getGroupMembers);

// Get Group Admin
router.get("/get-group-admin", authUser, getGroupAdmin);

// Edit Group
router.put("/edit-group", authUser, editGroup);

// Delete Group
router.delete("/delete-group", authUser, deleteGroup);

export default router;
