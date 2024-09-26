const express = require("express");
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me/blogs', authMiddleware, userController.getMyBlogsByStatus);

router.get('/:userId/blogs', userController.getPublicBlogs);

module.exports = router;
