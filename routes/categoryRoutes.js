import express from 'express';

import { getAllCategories, getCategoryById, createCategory, updateCategoryById, deleteCategoryById } from '../controllers/categories.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleWare.js';


const router = express.Router();
//only admin can manage categories
//get all categories
router.get('/', verifyToken, isAdmin, getAllCategories);
//create new category
router.post('/', verifyToken, isAdmin, createCategory);
//get category by id
router.get('/:id', verifyToken, isAdmin, getCategoryById);
//update category by id
router.put('/:id', verifyToken, isAdmin, updateCategoryById);
//delete category by id
router.delete('/:id', verifyToken, isAdmin, deleteCategoryById);

export default router;