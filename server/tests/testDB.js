import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Content from "../models/Content.js";
import Recommendation from "../models/Recommendation.js";

dotenv.config();

const { TEST_MONGODB_URI } = process.env;

const testDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(TEST_MONGODB_URI, {
      dbName: "reco-sphere-test",
      serverSelectionTimeoutMS: 5000, // Timeout if MongoDB is unreachable
    });
    console.log("Connected to MongoDB successfully!");

    // Clear existing collections to avoid duplicate entries
    await User.deleteMany({});
    await Content.deleteMany({});
    await Recommendation.deleteMany({});
    console.log("Cleared existing collections for testing!");

    // Test User Schema
    const user = new User({
      email: "testuser@example.com",
      password: "securepassword123",
      preferences: ["Action", "Comedy"],
      history: [],
    });
    await user.save();
    console.log("User saved:", user);

    // Test Content Schema
    const content = new Content({
      title: "Inception",
      genre: ["Action", "Sci-Fi"],
      rating: 8.8,
      metadata: { director: "Christopher Nolan" },
    });
    await content.save();
    console.log("Content saved:", content);

    // Test Recommendation Schema
    const recommendation = new Recommendation({
      userId: user._id,
      contentId: content._id,
      reason: "Recommended based on your preferences.",
    });
    await recommendation.save();
    console.log("Recommendation saved:", recommendation);

    // Close the database connection
    await mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error testing MongoDB:", error);

    // Ensure connection is closed on error
    await mongoose.connection.close();
    process.exit(1); // Exit with failure
  }
};

testDB();
