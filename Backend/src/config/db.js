import mongoose from 'mongoose';
import 'dotenv/config';
import { DB_NAME } from '../../constants';

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log('Database connected Successfully');
  } catch (err) {
    console.error('error occurred while connecting to database ' + err.message);
    process.exit(1);
  }
};

export { connectDB };
