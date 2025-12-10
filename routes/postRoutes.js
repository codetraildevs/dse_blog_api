import express from 'express';
import { getAllPosts, getPostById, createPost, updatePostById, deletePostById,getPostsByAuthorId,getPostsByCategoryId,getPublishedPosts } from '../controllers/postController.js';
import { verifyToken,isAdmin,isAuthor } from '../middleware/authMiddleWare.js';


const router = express.Router();
//get all posts - public
router.get('/', getAllPosts);
//get post by id - private
router.get('/:id', verifyToken,isAdmin||isAuthor, getPostById);
//create new post - private
router.post('/', verifyToken, isAdmin||isAuthor, createPost);
//update post by id - private
router.put('/:id', verifyToken, isAdmin||isAuthor, updatePostById);
//delete post by id - private
router.delete('/:id', verifyToken, isAdmin||isAuthor, deletePostById);
//get posts by author id - public
router.get('/author/:authorId', getPostsByAuthorId);
//get posts by category id - public
router.get('/category/:categoryId', getPostsByCategoryId);
//get published posts - public
router.get('/published', getPublishedPosts);

export default router;