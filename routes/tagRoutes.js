import express from 'express';
import { getAllTags, getTagById, createTag, updateTagById, deleteTagById } from '../controllers/tag.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleWare.js';

const router = express.Router();
//only admin can manage tags
//get all tags
router.get('/', verifyToken, isAdmin, getAllTags);
//create new tag
router.post('/', verifyToken, isAdmin, createTag);
//get tag by id
router.get('/:id', verifyToken, isAdmin, getTagById);

//update tag by id
router.put('/:id', verifyToken, isAdmin, updateTagById);
//delete tag by id
router.delete('/:id', verifyToken, isAdmin, deleteTagById);

export default router;