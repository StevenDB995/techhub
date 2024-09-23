const mongoose = require('mongoose');

const { DB_URI } = process.env;
mongoose.set('debug', true);

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
