const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

router.get('/public', blogController.getPublicBlogs);
router.get('/', blogController.getBlogsByStatus);
router.get('/:id', blogController.getBlogById);
router.post('/', blogController.createBlog);
router.patch('/:id', blogController.updateBlogById);
router.delete('/:id', blogController.deleteBlogById);

module.exports = router;