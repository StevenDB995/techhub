const express = require('express');
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/public', blogController.getPublicBlogs);
router.get('/', blogController.getBlogsByStatus);
router.get('/:id', blogController.getBlogById);
router.post('/', authMiddleware, blogController.createBlog);
router.patch('/:id',authMiddleware, blogController.updateBlogById);
router.delete('/:id', authMiddleware, blogController.deleteBlogById);

module.exports = router;
