const express = require('express');
const blogController = require('../controllers/blogController');
const { auth, optionalAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', blogController.getAllBlogs);
router.get('/:id', optionalAuth, blogController.getBlogById);

router.post('/', auth, blogController.createBlog);
router.put('/:id', auth, blogController.updateBlogById);
router.delete('/:id', auth, blogController.deleteBlogById);

router.get('/images/token', auth, blogController.getImgurAccessToken);
router.post('/images', auth, blogController.createImageMetadata);

module.exports = router;
