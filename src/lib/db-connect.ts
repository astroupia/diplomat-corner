import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

console.log("MONGODB_URI:", MONGODB_URI); // Debugging line

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

const cached = (global as any).mongooseCache || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "diplomat-corner",
      })
      .then((mongoose) => {
        console.log(" MongoDB connected successfully!");
        return mongoose;
      })
      .catch((err) => {
        console.error(" MongoDB connection error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  (global as any).mongooseCache = cached;
  return cached.conn;
}

export default dbConnect;
