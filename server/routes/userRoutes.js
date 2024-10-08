const express = require("express");
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, userController.getCurrentUser);
router.get('/me/blogs', authMiddleware, userController.getMyBlogsByStatus);
router.get('/me/blogs/:blogId', authMiddleware, userController.getMyBlogById);

router.get('/:userId/blogs', userController.getPublicBlogs);
// router.put('/:userId', userController.updateUser);

module.exports = router;
