// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error('MONGODB_URI is not defined in environment variables');
// }

// const cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = 
//   (global as any).mongoose || { conn: null, promise: null };

// export const connectToDatabase = async () => {
//   if (cached.conn) {
//     console.log('Using cached MongoDB connection');
//     return cached.conn;
//   }

//   try {
//     console.log('Connecting to MongoDB with URI:', MONGODB_URI.replace(/:([^@]+)@/, ':<hidden>@'));
//     cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
//       dbName: 'diplomat-corner',
//       bufferCommands: false,
//       connectTimeoutMS: 30000,
//       socketTimeoutMS: 30000,
//       serverSelectionTimeoutMS: 30000,
//       family: 4, // Force IPv4
//     });

//     cached.conn = await cached.promise;
//     console.log(`Connected to database: ${mongoose.connection.db?.databaseName || 'unknown'}`);
//     (global as any).mongoose = cached;
//     return cached.conn;
//   } catch (error) {
//     console.error('Database connection failed:', {
//       message: (error as Error).message,
//       code: (error as any).code,
//       stack: (error as Error).stack,
//     });
//     throw error; // Throw raw error for better upstream handling
//   }
// };

import mongoose, { Mongoose } from 'mongoose';

// Define the cache interface for type safety
interface CachedConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Initialize cache locally (not global)
let cached: CachedConnection = { conn: null, promise: null };

const MONGODB_URI = process.env.MONGODB_URI;

export const connectToDatabase = async (): Promise<Mongoose> => {
  // Return cached connection if it exists
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  // Check for MONGODB_URI
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is missing');
  }

  try {
    console.log('Connecting to MongoDB with URI:', MONGODB_URI.replace(/:([^@]+)@/, ':<hidden>@'));
    // Create connection promise if it doesn’t exist
    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
      dbName: 'diplomat-corner',
      bufferCommands: false,
    });

    // Await the connection and store it
    cached.conn = await cached.promise;
    console.log(`Connected to database: ${cached.conn.connection.db?.databaseName || 'unknown'}`);

    return cached.conn;
  } catch (error) {
    console.error('Database connection failed:', {
      message: (error as Error).message,
      code: (error as any).code, // `code` might not always exist, kept as `any` for now
      stack: (error as Error).stack,
    });
    throw error; // Throw raw error for upstream handling
  }
};