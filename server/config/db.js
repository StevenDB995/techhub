const mongoose = require('mongoose');

const { NODE_ENV, DB_URI } = process.env;

if (NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
