import express from 'express';
import { getAllUsers,getUserById,deleteUserById,updateUserById } from '../controllers/userController.js';
import {verifyToken, isAdmin} from '../middleware/authMiddleWare.js';

const router = express.Router();
//get all users - admin only
router.get('/',verifyToken,isAdmin,getAllUsers);
//get user by id - admin only
router.get('/:id',verifyToken,isAdmin,getUserById);
//delete user by id - admin only
router.delete('/:id',verifyToken,isAdmin,deleteUserById);
//update user by id - admin only
router.put('/:id',verifyToken,isAdmin,updateUserById);

export default router;