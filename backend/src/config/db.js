import mongoose from 'mongoose';
import config from 'config';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || config.get('mongodb.uri');
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}
