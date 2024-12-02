import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Content from "../models/Content.js";

const logErrorAndExit = (message, err) => {
  throw new Error(`${message} ${err?.message || ""}`);
};

const seedDatabase = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Content.deleteMany({});

    // Insert seed data
    await User.insertMany([
      { email: "admin@example.com", password: "admin123", role: "admin" },
      { email: "user@example.com", password: "user123", role: "user" },
    ]);

    await Content.insertMany([
      { title: "Example Movie", genre: ["Action"], rating: 8.5 },
      { title: "Example Show", genre: ["Drama"], rating: 7.9 },
    ]);

    // Exit the process after seeding
    process.exit(0);
  } catch (err) {
    logErrorAndExit("Error seeding database:", err);
    process.exit(1); // This will ensure the process exits after throwing
  }
};

seedDatabase();
