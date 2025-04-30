const express = require("express");
const userController = require('../controllers/userController');
const { auth, optionalAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', auth, userController.getCurrentUser);
router.patch('/me', auth, userController.updateCurrentUser);

router.get('/:username/blogs', optionalAuth, userController.getBlogsByUsername);

module.exports = router;
