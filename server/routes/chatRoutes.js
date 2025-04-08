import express from 'express';
import { getChatListForDm } from '../controllers/chatController.js';
import authUser  from '../middlewares/authMiddleware.js'; 
import { getAllUsers } from '../controllers/chatController.js';

const router = express.Router();


// Get messages
router.get('/chat-list-for-dm', authUser, getChatListForDm); // Protect the route with authUser

// Get all users
router.get('/all-users', authUser, getAllUsers); // Protect the route with authUser


export default router;

