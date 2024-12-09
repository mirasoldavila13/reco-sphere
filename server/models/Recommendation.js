/**
 * Recommendation Model
 *
 * This module defines the schema and model for storing personalized recommendations
 * for users in the MongoDB database. Recommendations link users to specific content
 * and include metadata about why the recommendation was made.
 *
 * Key Features:
 * - Tracks the user and content associated with the recommendation.
 * - Provides customizable reasons for the recommendation.
 * - Supports recommendation statuses (e.g., "viewed", "dismissed").
 * - Includes metadata for algorithm type and relevance scores.
 * - Implements indexing to prevent duplicate recommendations for the same user and content.
 *
 * Usage:
 * 1. Import this model into your services or controllers to manage recommendations.
 * 2. Use it for querying, creating, or updating recommendations for users.
 */

import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true,
    },
    reason: {
      type: String,
      default: "Recommended based on your preferences.",
      minlength: 10,
      maxlength: 500,
      trim: true,
    },
    status: {
      type: String,
      enum: ["viewed", "dismissed", "pending"],
      default: "pending",
    },
    context: {
      algorithm: {
        type: String,
        default: "collaborative-filtering",
      },
      score: {
        type: Number,
        default: null,
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Prevent duplicate recommendations for the same user and content
recommendationSchema.index({ userId: 1, contentId: 1 }, { unique: true });

const Recommendation = mongoose.model("Recommendation", recommendationSchema);

export default Recommendation;
