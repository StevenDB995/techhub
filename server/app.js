const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');
require('dotenv').config();

const { DEV_HOST } = process.env;

const app = express();
const corsOptions = {
  origin: [DEV_HOST]
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json()) // handle json request body

// Use the centralized API routes
app.use('/api', apiRoutes);

module.exports = app;
