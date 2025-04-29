import express from 'express';
import passport from 'passport';
import { 
    registerUser,
    logoutUser,
    loginUser,
    googleLogin,
    requestPasswordReset,
    resetPassword
 } 
 from '../controllers/authController.js';
import { checkAuth } from '../middlewares/checkAuth.js';
import authUser from '../middlewares/authMiddleware.js';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser )

// Google login route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


// Google login callback route
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleLogin);

//checks auth for login
router.get('/check', checkAuth)

router.post('/logout',authUser, logoutUser);

// Password reset routes
router.post('/request-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
