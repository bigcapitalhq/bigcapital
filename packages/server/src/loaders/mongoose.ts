import config from '@/config';
import mongoose from 'mongoose';

export default async (): Promise<mongoose.Connection> => {
  // Connect to MongoDB using the database URL from your config
  await mongoose.connect(config.mongoDb.databaseURL);

  // Return the default connection
  return mongoose.connection;
};
