import express from 'express';
import { registerUser } from '../controllers/userController.js';
import { loginUser } from '../controllers/userController.js'

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser )



export default router;