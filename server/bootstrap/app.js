import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import { BASE_API_PATH } from '../config/constants.js';
import apiRoutes from '../routes/apiRoutes.js';

const app = express();

// Middlewares
app.use(express.json()); // handle json request body
app.use(cookieParser());

// Use the centralized API routes
app.use(BASE_API_PATH, apiRoutes);

if (process.env.NODE_ENV === 'production') {
  // Serve the static files from the React app (in /client/dist)
  app.use(express.static(path.join(__dirname, '../dist')));

  // All other routes should serve the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

export default app;
