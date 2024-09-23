const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');

const { NODE_ENV, CLIENT_URL } = process.env;

const app = express();
const corsOptions = {
  origin: NODE_ENV === 'development' && CLIENT_URL
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json()); // handle json request body

// Use the centralized API routes
app.use('/api', apiRoutes);

module.exports = app;
