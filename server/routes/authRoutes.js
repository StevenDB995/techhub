const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/isAuthenticated', authMiddleware, authController.isAuthenticated);
router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;
