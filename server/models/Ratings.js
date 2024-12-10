/**
 * Rating Model
 *
 * This module defines the schema and model for storing user-submitted ratings
 * for movies or TV shows in the MongoDB database. It tracks the user, the content,
 * and their respective rating scores.
 *
 * Key Features:
 * - Tracks the user and the TMDb content they rated.
 * - Stores rating values within a 0-10 range.
 * - Automatically manages creation and update timestamps.
 *
 * Usage:
 * 1. Import this model to manage user-submitted ratings.
 * 2. Use it to add, update, or retrieve ratings for specific content and users.
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
