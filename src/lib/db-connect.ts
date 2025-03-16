// lib/db-connect.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing in environment variables");
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const cached: Cached = (global as any).mongoose || { conn: null, promise: null };
(global as any).mongoose = cached;

export const connectToDatabase = async () => {
  if (cached.conn) {
    console.log("Reusing existing MongoDB connection, state:", mongoose.connection.readyState);
    return cached.conn;
  }

  try {
    console.log("Attempting to connect to MongoDB...");
    cached.promise =
      cached.promise ||
      mongoose.connect(MONGODB_URI, {
        dbName: "diplomat-corner",
        bufferCommands: false,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 30000,
      });

    cached.conn = await cached.promise;
    const dbName = mongoose.connection.db?.databaseName || "unknown";
    console.log(`Connected to database: ${dbName}`);
    console.log("Connection State:", mongoose.connection.readyState); // 1 = connected
    console.log("Registered Models:", Object.keys(mongoose.models));
    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    cached.promise = null; // Reset for retry
    throw new Error(`Failed to connect to MongoDB: ${(error as Error).message}`);
  }
};