import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || process.env.karirk_MONGODB_URI || "mongodb://localhost:27017/karirak";

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("connected");
  } catch (error) {
    console.error("error", error);
  }
}

export default connectDB;