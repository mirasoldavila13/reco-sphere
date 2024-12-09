/**
 * Content Model
 *
 * This module defines the schema and model for storing content information in the MongoDB database.
 * Content can represent movies, TV shows, or other media, with metadata for rich descriptions.
 *
 * Key Features:
 * - Includes validation for required fields like `title`, `slug`, and `genre`.
 * - Supports flexible metadata storage (e.g., external IDs, runtime, description).
 * - Uses Mongoose timestamps to track when records are created or updated.
 * - Implements indexing for efficient querying by `title` and `genre`.
 *
 * Usage:
 * 1. Import this model into your services or controllers for CRUD operations.
 * 2. Use it to save, retrieve, update, or delete content records in the database.
 */

import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    genre: {
      type: [String],
      required: true,
      validate: {
        validator(value) {
          return value.length > 0;
        },
        message: "At least one genre must be specified.",
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    metadata: {
      externalId: { type: String, default: null },
      releaseDate: { type: Date, default: null },
      runtime: { type: Number, default: null },
      description: { type: String, default: "" },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt`
  },
);

// Index for efficient lookups
contentSchema.index({ title: 1, genre: 1 });

const Content = mongoose.model("Content", contentSchema);

export default Content;
