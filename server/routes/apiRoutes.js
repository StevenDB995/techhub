const express = require('express');
const authRoutes = require('./authRoutes');
const blogRoutes = require('./blogRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);
router.use('/users', userRoutes);

module.exports = router;
