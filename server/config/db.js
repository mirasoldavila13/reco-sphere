import mongoose from "mongoose";

const connectDB = async (MONGODB_URI) => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "reco-sphere",
    });
  } catch (err) {
    throw new Error(`Error connecting to MongoDB: ${err.message}`);
  }
};

export default connectDB;
