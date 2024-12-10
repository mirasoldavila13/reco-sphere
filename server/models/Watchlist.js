/**
 * Watchlist Model
 *
 * This module defines the schema and model for storing users' watchlist items
 * in the MongoDB database. It links users to specific content they want to watch.
 *
 * Key Features:
 * - Tracks the user and the TMDb content they added to their watchlist.
 * - Supports both movies and TV shows as media types.
 * - Automatically manages creation and update timestamps.
 *
 * Usage:
 * 1. Import this model to manage watchlist content for users.
 * 2. Use it to add, remove, or retrieve watchlist items for users.
 */

import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
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
    mediaType: {
      type: String,
      enum: ["movie", "tv"],
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Prevent duplicate watchlist items for the same user and content
watchlistSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

export default Watchlist;
