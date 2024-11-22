// api/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://gahanbhat:sova2002@notes.zsnqy.mongodb.net/?retryWrites=true&w=majority&appName=Notes"
    );
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  }
};

export default connectDB;
