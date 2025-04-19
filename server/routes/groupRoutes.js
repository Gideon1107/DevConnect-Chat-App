import { Router } from "express";
import { createGroup } from "../controllers/groupController.js";
import authUser from "../middlewares/authMiddleware.js";
import { 
    getUserGroups, 
    getGroupMembers, 
    getGroupAdmin, 
    editGroup, 
    deleteGroup, 
    leaveGroup, 
    addGroupMember, 
    getGroupMessages,
    removeUserFromGroup } from "../controllers/groupController.js";


const router = Router();

// Create a Group
router.post("/create-group", authUser, createGroup);

// Get User Groups
router.get("/get-user-groups", authUser, getUserGroups);

// Get Group Members  
router.get("/get-group-members", authUser, getGroupMembers);

// Get Group Messages
router.get("/get-group-messages/:groupId", authUser, getGroupMessages);

// Get Group Admin
router.get("/get-group-admin", authUser, getGroupAdmin);

// Edit Group
router.put("/edit-group", authUser, editGroup);

// Delete Group
router.delete("/delete-group", authUser, deleteGroup);

// Leave group
router.put("/leave-group", authUser, leaveGroup);

// Add User to Group
router.put("/add-group-members", authUser, addGroupMember);

router.put("/remove-group-member", authUser, removeUserFromGroup)

export default router;
