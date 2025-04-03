import express from 'express';
import { getChatListForDm } from '../controllers/chatController.js';
import authUser  from '../middlewares/authMiddleware.js'; 


const router = express.Router();


// Get messages
router.get('/chat-list-for-dm', authUser, getChatListForDm); // Protect the route with authUser



export default router;

