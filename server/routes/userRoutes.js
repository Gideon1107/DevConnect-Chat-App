import express from 'express';
import 
{ 
    getUserProfile, 
    updateUserProfile, 
    updateProfilePicture, 
    changePassword, 
    deleteUser, 
    deleteProfilePicture } 
    from '../controllers/userController.js';

import upload  from '../middlewares/upload.js'; // Assuming multer setup is in middlewares/multer.js
import authUser  from '../middlewares/authMiddleware.js'; // If authentication is needed


const router = express.Router();

// Get user profile
router.get('/profile', authUser, getUserProfile); // Protect the route with authUser

// Update user profile username
router.put('/update-profile', authUser, updateUserProfile); // Protect the route with authUser

//Update user profile Picture
router.put('/update-avatar', authUser, upload.single('profilePicture'), updateProfilePicture); // Protect the route with authUser and using multer

//Delete user profile picture
router.delete('/delete-avatar/:id', authUser,deleteProfilePicture )

//Change user password
router.put('/change-password', authUser, changePassword);

//Delete User
router.delete('/delete/:id', authUser, deleteUser)

export default router;
