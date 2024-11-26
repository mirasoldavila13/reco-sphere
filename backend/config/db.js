import mongoose from "mongoose";

const connectDB = async (MONGODB_URI) => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "reco-sphere", 
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); 
  }
};


export default connectDB;
