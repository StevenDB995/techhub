const express = require("express");
const userController = require('../controllers/userController');
const { auth, optionalAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', auth, userController.getCurrentUser);
router.get('/:username/blogs', optionalAuth, userController.getBlogsByUsername);

// router.put('/:userId', userController.updateUser);

module.exports = router;
