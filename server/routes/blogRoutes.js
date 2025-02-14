const express = require('express');
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);

router.post('/', authMiddleware, blogController.createBlog);
router.put('/:id', authMiddleware, blogController.updateBlogById);
router.delete('/:id', authMiddleware, blogController.deleteBlogById);

router.get('/images/imgur-client-id', authMiddleware, blogController.getImgurClientId);
router.post('/images', authMiddleware, blogController.createImageMetadata);

module.exports = router;
