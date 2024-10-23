import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);

export const userRouter=router;
