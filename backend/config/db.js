// import mongoose from "mongoose";

// const connectDB = async (MONGODB_URI) => {
//   try {
//     await mongoose.connect(MONGODB_URI);
//     console.log("Connected to MongoDB");
//   } catch (err) {
//     console.error("Error connecting to MongoDB:", err);
//     process.exit(1);
//   }
// };


import mongoose from "mongoose";

const connectDB = async (MONGODB_URI) => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "reco-sphere", // Ensure you include the database name
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit process on failure
  }
};

// Export `connectDB` as the default export
export default connectDB;
