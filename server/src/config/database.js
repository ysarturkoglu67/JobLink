import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Bağlandi");
  } catch (error) {
    console.error("❌ MongoDB Bağlanti Hatasi:", error.message);
    process.exit(1);
  }
};