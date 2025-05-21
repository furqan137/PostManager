import mongoose, { Mongoose } from 'mongoose';

export async function dbConnect(): Promise<Mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  return mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  });
}
