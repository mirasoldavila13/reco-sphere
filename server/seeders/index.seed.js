import connectDB from "../config/db.js"; // Import the DB connection function
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

import { seedUsers } from "./users.seed.js";
import { seedContent } from "./content.seed.js";
import { seedFavorites } from "./favorites.seed.js";
import { seedWatchlist } from "./watchlist.seed.js";
import { seedRatings } from "./ratings.seed.js";
import { seedRecommendations } from "./recommendation.seed.js"; // Import recommendations seeder

// Main function to seed the database
const seedDatabase = async () => {
  try {
    // Pass the MONGODB_URI from environment variables to connectDB
    await connectDB(process.env.MONGODB_URI);

    console.log("Seeding database...");
    const users = await seedUsers(); // Seed users first
    const content = await seedContent(); // Seed content
    await seedFavorites(users); // Seed favorites using users
    await seedWatchlist(users); // Seed watchlist using users
    await seedRatings(users); // Seed ratings using users
    await seedRecommendations(users, content); // Seed recommendations using users and content

    console.log("Database seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error.message);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
