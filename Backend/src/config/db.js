import mongoose from 'mongoose';
import 'dotenv/config';
import { DB_NAME } from '../../constants.js';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState >= 1) {
    return cached.conn;
  }

  if (mongoose.connection.readyState >= 1) {
    cached.conn = mongoose.connection;
    return cached.conn;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables. Please check your Vercel Project Settings.');
  }

  if (!cached.promise) {
    const opts = {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongooseInstance) => {
        console.log('Database connected Successfully');
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        console.error('Error occurred while connecting to database:', err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export { connectDB };
