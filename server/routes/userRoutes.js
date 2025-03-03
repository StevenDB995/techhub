const express = require("express");
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, userController.getCurrentUser);
// Conditional authorization applies
router.get('/:username/blogs', userController.getBlogsByUsername);

// router.put('/:userId', userController.updateUser);

module.exports = router;
