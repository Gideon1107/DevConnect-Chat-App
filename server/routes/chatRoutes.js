import express from 'express';
import { getChatListForDm, deleteChat } from '../controllers/chatController.js';
import authUser  from '../middlewares/authMiddleware.js'; 
import { getAllUsers } from '../controllers/chatController.js';

const router = express.Router();


// Get messages
router.get('/chat-list-for-dm', authUser, getChatListForDm); // Protect the route with authUser

// Get all users
router.get('/all-users', authUser, getAllUsers); // Protect the route with authUser

// Delete chat
router.post('/delete-chat', authUser, deleteChat) 


export default router;

