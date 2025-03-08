import express from 'express';
import { adminLogin } from '../controllers/authController.js';
import adminAuth from '../middlewares/adminAuth.js'
import {getAllUserProfile, deleteUser, getUserProfile} from '../controllers/adminController.js'


const router = express.Router();


// Login admin
router.post('/login', adminLogin)


// Get all user profile
router.get('/all-users', adminAuth, getAllUserProfile); // Protect the route with adminAuth

// Get single user profile
router.get('/get-user/:id', adminAuth, getUserProfile); // Protect the route with adminAuth

// Delete user
router.delete('/delete-user/:id', adminAuth, deleteUser); // Protect the route with adminAuth




export default router;