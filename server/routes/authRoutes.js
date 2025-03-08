import express from 'express';
import passport from 'passport';
import { registerUser } from '../controllers/authController.js';
import { loginUser } from '../controllers/authController.js'
import { googleLogin } from '../controllers/authController.js'

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser )

// Google login route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


// Google login callback route
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleLogin);

export default router;