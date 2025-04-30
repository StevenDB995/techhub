const express = require('express');
const imgurController = require('../controllers/imgurController');
const { auth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/token', auth, imgurController.getImgurAccessToken);

module.exports = router;
