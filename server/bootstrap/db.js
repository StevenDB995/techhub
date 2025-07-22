import mongoose from 'mongoose';

const { NODE_ENV, DB_URI } = process.env;
console.log('db:', process.env.DB_URI);

if (NODE_ENV !== 'production') {
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

export default connectDB;
