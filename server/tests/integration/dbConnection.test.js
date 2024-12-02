import mongoose from "mongoose";
import { jest } from "@jest/globals";
import dotenv from "dotenv";
import User from "../../models/User.js";
import Content from "../../models/Content.js";
import Recommendation from "../../models/Recommendation.js";

dotenv.config();

const { TEST_MONGODB_URI } = process.env;

// Increase Jest's default timeout for this test suite
jest.setTimeout(30000); // 30 seconds

describe("MongoDB Integration Tests", () => {
  beforeAll(async () => {
    // Connect to MongoDB
    await mongoose.connect(TEST_MONGODB_URI, {
      dbName: "reco-sphere-test",
      serverSelectionTimeoutMS: 5000, // Timeout for MongoDB server selection
    });

    // Clear existing collections to avoid duplicate entries
    await User.deleteMany({});
    await Content.deleteMany({});
    await Recommendation.deleteMany({});
  });

  afterAll(async () => {
    // Close the database connection
    await mongoose.connection.close();
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
    const user = await User.findOne({ email: "testuser@example.com" });
    const content = await Content.findOne({ title: "Inception" });

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
      history: ["id1", "id2", "id3"],
    });

    const savedUser = await user.save();
    expect(savedUser.history).toEqual(["id1", "id2", "id3"]);
  });

  test("should fail to save a user with invalid history", async () => {
    const user = new User({
      email: "testuser3@example.com",
      password: "securepassword123",
      preferences: ["Action", "Comedy"],
      history: ["id1", 123, null],
    });

    await expect(user.save()).rejects.toThrow(
      "History must be an array of valid IDs",
    );
  });
});
