import express from 'express';
import * as blogController from '../controllers/blogController.js';
import { auth, optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', blogController.getAllBlogs);
router.get('/:id', optionalAuth, blogController.getBlogById);

router.post('/', auth, blogController.createBlog);
router.put('/:id', auth, blogController.updateBlogById);
router.delete('/:id', auth, blogController.deleteBlogById);

router.post('/images', auth, blogController.createImageMetadata);

export default router;
