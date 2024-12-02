import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../../models/User.js";
import Content from "../../models/Content.js";
import Recommendation from "../../models/Recommendation.js";

dotenv.config();

const { TEST_MONGODB_URI } = process.env;

describe("MongoDB Integration Tests", () => {
  beforeAll(async () => {
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
  });

  afterAll(async () => {
    // Close the database connection
    await mongoose.connection.close();
    console.log("Database connection closed.");
  });

  test("should connect to the database", () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  });

  test("should save a user document", async () => {
    const user = new User({
      email: "testuser@example.com",
      password: "securepassword123",
      preferences: ["Action", "Comedy"],
      history: [],
    });

    const savedUser = await user.save();
    console.log("User saved:", savedUser);

    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe("testuser@example.com");
  });

  test("should save a content document", async () => {
    const content = new Content({
      title: "Inception",
      genre: ["Action", "Sci-Fi"],
      rating: 8.8,
      metadata: { director: "Christopher Nolan" },
      slug: "inception",
    });
    const savedContent = await content.save();
    expect(savedContent._id).toBeDefined();
    expect(savedContent.title).toBe("Inception");
  });

  test("should save a recommendation document", async () => {
    // Ensure user and content documents exist
    const user = await User.findOne({ email: "testuser@example.com" });
    const content = await Content.findOne({ title: "Inception" });

    // Validate that user and content are not null
    expect(user).toBeDefined();
    expect(content).toBeDefined();

    const recommendation = new Recommendation({
      userId: user._id,
      contentId: content._id,
      reason: "Recommended based on your preferences.",
    });
    const savedRecommendation = await recommendation.save();
    expect(savedRecommendation._id).toBeDefined();
    expect(savedRecommendation.reason).toBe(
      "Recommended based on your preferences.",
    );
  });

  test("should save a user with valid history", async () => {
    const user = new User({
      email: "testuser2@example.com",
      password: "securepassword123",
      preferences: ["Action", "Comedy"],
      history: ["id1", "id2", "id3"], // valid history
    });
    const savedUser = await user.save();
    expect(savedUser.history).toEqual(["id1", "id2", "id3"]);
  });

  test("should fail to save a user with invalid history", async () => {
    const user = new User({
      email: "testuser3@example.com",
      password: "securepassword123",
      preferences: ["Action", "Comedy"],
      history: ["id1", 123, null], // invalid history
    });
    await expect(user.save()).rejects.toThrow(
      "History must be an array of valid IDs",
    );
  });
});
