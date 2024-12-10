import mongoose from "mongoose";

/**
 * Favorite Model
 *
 * This schema is designed to store a user's favorite movies or TV shows.
 * It tracks the user ID and TMDb content ID and distinguishes between movies and TV.
 */

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    tmdbId: {
      type: String, // TMDb ID for the movie or TV show
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["movie", "tv"], // Specifies whether it's a movie or TV show
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now, // Automatically sets the date when added
    },
  },
  { timestamps: true }, // Automatically adds createdAt and updatedAt fields
);

// Prevent duplicate entries for the same user and content
favoriteSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

// Ensure the model is not overwritten if it's already compiled
const Favorite =
  mongoose.models.Favorite || mongoose.model("Favorite", favoriteSchema);

export default Favorite;
