import express from 'express';
import * as imgurController from '../controllers/imgurController.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/token', auth, imgurController.getImgurAccessToken);

export default router;
