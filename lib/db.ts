// lib/db.ts
import mongoose from "mongoose";

export async function connectDB() {
  // 已经连上就不用再连
  if (mongoose.connection.readyState >= 1) return;

  // 调试：看看环境变量到底是什么
  console.log(">>> MONGODB_URI in env =", process.env.MONGODB_URI);

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not set");
  }

  await mongoose.connect(process.env.MONGODB_URI);
}