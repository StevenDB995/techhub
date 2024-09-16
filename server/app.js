const express = require('express');
const cors = require('cors');

const app = express();
const corsOptions = {
  origin: ['http://localhost:5173']
};

// Middleware
app.use(cors(corsOptions));

// Routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Hello World!'
  });
});

module.exports = app;
