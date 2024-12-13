/**
 * Rating Model
 *
 * This module defines the schema and model for managing user-submitted ratings in a MongoDB database.
 * It supports tracking and enforcing unique ratings for each user and content pair, ensuring data integrity.
 *
 * Key Features:
 * - **User-Content Association**:
 *   - Links each rating to a specific user (`userId`) and content item (`tmdbId`).
 * - **Rating System**:
 *   - Enforces a scoring system with values ranging from 0 to 10, allowing half-point ratings.
 * - **Timestamps**:
 *   - Automatically tracks when ratings are created or updated.
 * - **Unique Constraint**:
 *   - Prevents duplicate ratings by the same user for the same content.
 *
 * Schema Details:
 * - **Fields**:
 *   - `userId` (ObjectId, required): References the `User` model to associate the rating with a user.
 *   - `tmdbId` (String, required): TMDb ID of the rated content, identifying movies or TV shows.
 *   - `rating` (Number, required): Numeric score (0–10) provided by the user.
 *   - `ratedAt` (Date, default: `Date.now`): Tracks when the rating was submitted.
 * - **Indexing**:
 *   - Enforces uniqueness for the combination of `userId` and `tmdbId` to ensure a single rating per user-content pair.
 * - **Timestamps**:
 *   - Utilizes Mongoose's `timestamps` feature to automatically add `createdAt` and `updatedAt` fields.
 *
 * Use Cases:
 * - Enable users to rate movies or TV shows in recommendation engines or streaming platforms.
 * - Support dynamic aggregation of average ratings for content.
 * - Retrieve user-specific ratings for personalized content curation.
 *
 * Example Usage:
 * ```javascript
 * import Rating from './models/Rating.js';
 *
 * // Add a new rating
 * const newRating = new Rating({
 *   userId: "603d2c5b2f8fb814b56f1d85",
 *   tmdbId: "550", // Example TMDb ID for "Fight Club"
 *   rating: 8.5, // User-provided score
 * });
 * await newRating.save();
 *
 * // Update an existing rating
 * const updatedRating = await Rating.findOneAndUpdate(
 *   { userId: "603d2c5b2f8fb814b56f1d85", tmdbId: "550" },
 *   { $set: { rating: 9 } },
 *   { new: true }
 * );
 *
 * // Query all ratings for a specific user
 * const userRatings = await Rating.find({ userId: "603d2c5b2f8fb814b56f1d85" });
 *
 * // Remove a rating
 * await Rating.findOneAndDelete({ userId: "603d2c5b2f8fb814b56f1d85", tmdbId: "550" });
 * ```
 *
 * Security and Best Practices:
 * - Validate `userId`, `tmdbId`, and `rating` inputs at the service/controller level to prevent invalid data entries.
 * - Use the unique index on `userId` and `tmdbId` to maintain data consistency.
 * - Implement soft deletion (e.g., `isDeleted` flag) if historical rating data needs to be preserved.
 *
 * Technologies:
 * - **Mongoose**: Provides schema-based modeling with built-in validation for MongoDB.
 * - **MongoDB**: Facilitates efficient querying and storage of rating data for scalability.
 *
 * Future Enhancements:
 * - Introduce support for comments or reviews accompanying ratings.
 * - Add aggregate rating computations (e.g., average score) as virtual fields.
 * - Expand content identification to support alternative IDs (e.g., IMDb, internal IDs).
 */

import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tmdbId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    ratedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Prevent duplicate ratings for the same user and content
ratingSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
