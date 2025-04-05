import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const cached = (global as any).mongoose || { conn: null, promise: null };
export const connectToDatabase = async () => {
  if (cached.conn) {
    console.log("Using cached connection:", mongoose.connection.readyState);
    return cached.conn;
  }

  if (!MONGODB_URI) {
    console.error("MONGODB_URI is missing");
    throw new Error("MONGODB_URI is missing");
  }

  try {
    cached.promise =
      cached.promise ||
      mongoose.connect(MONGODB_URI, {
        dbName: "diplomat-corner",
        bufferCommands: false,
      });
    cached.conn = await cached.promise;
    console.log("Connection established:", mongoose.connection.readyState);
    console.log("Connected to database:", mongoose.connection.db?.databaseName);
    return cached.conn;
  } catch (error) {
    console.error("Connection failed:", error);
    throw error;
  }
};