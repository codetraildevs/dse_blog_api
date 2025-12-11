import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';
import {verifyToken, isAdmin} from '../middleware/authMiddleWare.js';
const router = express.Router();

router.post('/login', loginUser);
router.post('/register', verifyToken, isAdmin, registerUser);

export default router;