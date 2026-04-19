import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI);

if (!MONGO_URI) {
  throw new Error("❌ Please add MONGO_URI in .env");
}

// global cache (Next.js hot reload safe)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  try {
    if (cached.conn) {
      console.log("🟢 Using cached MongoDB connection");
      return cached.conn;
    }

    if (!cached.promise) {
      console.log("🟡 Connecting to MongoDB...");
      cached.promise = mongoose.connect(MONGO_URI);
    }

    cached.conn = await cached.promise;

    console.log("✅ MongoDB Connected Successfully");

    return cached.conn;
  } catch (error) {
    console.log("❌ MongoDB Connection Failed:", error.message);
    throw error;
  }
}