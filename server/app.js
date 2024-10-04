const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const apiRoutes = require('./routes/apiRoutes');
const constants = require('./config/constants');

const app = express();

// Middlewares
app.use(express.json()); // handle json request body
app.use(cookieParser());

// Use the centralized API routes
app.use(constants.BASE_API_PATH, apiRoutes);

if (process.env.NODE_ENV === 'production') {
  // Serve the static files from the React app (in /client/dist)
  app.use(express.static(path.join(__dirname, 'dist')));

  // All other routes should serve the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

module.exports = app;
