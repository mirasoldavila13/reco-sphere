import connectDB from "../config/db.js";
import User from "../models/User.js";
import Content from "../models/Content.js";

/**
 * Utility function to log errors and terminate the process.
 * Throws a structured error message for better debugging and ensures the process exits appropriately.
 * @param {string} message - The error message to log.
 * @param {Error} err - The error object, if available.
 */
const logErrorAndExit = (message, err) => {
  throw new Error(`${message} ${err?.message || ""}`);
};

/**
 * Main function to seed the database with initial test data.
 * This script performs the following steps:
 * 1. Connects to the MongoDB database.
 * 2. Clears existing data from the `User` and `Content` collections.
 * 3. Inserts a predefined set of users and content into the database for testing or demo purposes.
 * 4. Handles errors and exits the process with an appropriate status code.
 */
const seedDatabase = async () => {
  try {
    // Step 1: Connect to the MongoDB database
    await connectDB();

    // Step 2: Clear existing data to prevent duplication or conflicts
    await User.deleteMany({});
    await Content.deleteMany({});

    // Step 3: Insert seed data into the User collection
    await User.insertMany([
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123", // Note: Passwords should ideally be hashed for production.
        role: "admin",
      },
      {
        name: "Regular User",
        email: "user@example.com",
        password: "user123", // Note: These passwords are for development purposes only.
        role: "user",
      },
      {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password123",
        role: "user",
      },
      {
        name: "Jane Smith",
        email: "janesmith@example.com",
        password: "password123",
        role: "user",
      },
    ]);

    // Step 4: Insert seed data into the Content collection
    await Content.insertMany([
      {
        title: "Inception",
        slug: "inception",
        genre: ["Action", "Sci-Fi"],
        rating: 8.8,
        metadata: {
          externalId: "tt1375666",
          releaseDate: new Date("2010-07-16"),
          runtime: 148,
          description:
            "A thief who steals corporate secrets through dream-sharing technology.",
        },
      },
      {
        title: "Breaking Bad",
        slug: "breaking-bad",
        genre: ["Drama", "Crime"],
        rating: 9.5,
        metadata: {
          externalId: "tt0903747",
          releaseDate: new Date("2008-01-20"),
          runtime: null, // Runtime not applicable for series
          description:
            "A high school chemistry teacher turned methamphetamine producer.",
        },
      },
      {
        title: "The Dark Knight",
        slug: "the-dark-knight",
        genre: ["Action", "Crime", "Drama"],
        rating: 9.0,
        metadata: {
          externalId: "tt0468569",
          releaseDate: new Date("2008-07-18"),
          runtime: 152,
          description:
            "Batman faces the Joker, a criminal mastermind bent on chaos.",
        },
      },
      {
        title: "The Office",
        slug: "the-office",
        genre: ["Comedy"],
        rating: 8.9,
        metadata: {
          externalId: "tt0386676",
          releaseDate: new Date("2005-03-24"),
          runtime: null,
          description: "A mockumentary on a group of typical office workers.",
        },
      },
    ]);

    // Step 5: Exit the process successfully after seeding
    process.exit(0);
  } catch (err) {
    // Handle errors gracefully and log a structured message
    logErrorAndExit("Error seeding database:", err);
    process.exit(1); // Exit with an error code
  }
};

// Execute the seed script
seedDatabase();
