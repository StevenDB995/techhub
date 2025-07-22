import express from 'express';
import * as userController from '../controllers/userController.js';
import { auth, optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/me', auth, userController.getCurrentUser);
router.patch('/me', auth, userController.updateCurrentUser);

router.get('/:username/blogs', optionalAuth, userController.getBlogsByUsername);

export default router;
