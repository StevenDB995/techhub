import express from 'express';
import authRoutes from './authRoutes.js';
import blogRoutes from './blogRoutes.js';
import imgurRoutes from './imgurRoutes.js';
import userRoutes from './userRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);
router.use('/users', userRoutes);

router.use('/imgur', imgurRoutes);

export default router;
