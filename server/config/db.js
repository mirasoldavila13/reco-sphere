/**
 * Database Connection Module
 *
 * This module provides a function to establish a connection to a MongoDB database using Mongoose.
 * It is designed to be reusable and can handle connection errors gracefully.
 *
 * Key Features:
 * - Uses Mongoose for MongoDB interactions.
 * - Connects to the specified database using the provided URI.
 * - Explicitly sets the database name (`dbName`).
 * - Throws detailed errors to assist with debugging connection issues.
 *
 * Usage:
 * 1. Import the function into your server initialization script.
 * 2. Pass the MongoDB connection string (URI) when invoking the function.
 */

import mongoose from "mongoose";

/**
 * Connects to MongoDB using Mongoose.
 *
 * @param {string} MONGODB_URI- MongoDB connection string.
 * @throws Will throw an error if the connection fails.
 */
const connectDB = async (MONGODB_URI) => {
  try {
    // Attempt to connect to the database
    await mongoose.connect(MONGODB_URI, {
      dbName: "reco-sphere", // Explicitly set the database name
    });
  } catch (err) {
    // Throw a detailed error message for debugging connection issues
    throw new Error(`Error connecting to MongoDB: ${err.message}`);
  }
};

export default connectDB;
