/**
 * Favorite Model
 *
 * This module defines the schema and model for managing user favorites in a MongoDB database.
 * It tracks user-specific favorite movies and TV shows with unique constraints to prevent duplicates.
 *
 * Key Features:
 * - **User Association**:
 *   - References the `User` model to associate favorites with specific users.
 * - **Content Identification**:
 *   - Stores the TMDb ID for movies or TV shows, enabling integration with external metadata services.
 * - **Media Type**:
 *   - Differentiates between "movie" and "tv" using an enumerated `mediaType` field.
 * - **Automatic Timestamps**:
 *   - Uses Mongoose's `timestamps` feature to track when favorites are created or updated.
 * - **Indexing and Uniqueness**:
 *   - Enforces a unique constraint for each combination of `userId` and `tmdbId` to prevent duplicate favorites.
 *
 * Schema Details:
 * - **Fields**:
 *   - `userId` (ObjectId, required): References the `User` model to tie favorites to a specific user.
 *   - `tmdbId` (String, required): Unique identifier for content items from TMDb (The Movie Database).
 *   - `mediaType` (String, required): Specifies whether the content is a "movie" or "tv".
 *   - `addedAt` (Date, default: `Date.now`): Automatically sets the timestamp when a favorite is added.
 * - **Indexing**:
 *   - Ensures fast lookups by `userId` and `tmdbId` with a unique compound index.
 * - **Timestamps**:
 *   - Automatically tracks `createdAt` and `updatedAt` for audit and lifecycle management.
 *
 * Use Cases:
 * - Maintain user-specific lists of favorite movies or TV shows in streaming or recommendation applications.
 * - Enable dynamic filtering and retrieval of favorite content based on user profiles.
 * - Ensure data consistency by preventing duplicate entries for the same user and content.
 *
 * Example Usage:
 * ```javascript
 * import Favorite from './models/Favorite.js';
 *
 * // Add a new favorite
 * const newFavorite = new Favorite({
 *   userId: "603d2c5b2f8fb814b56f1d85",
 *   tmdbId: "550", // Example TMDb ID for "Fight Club"
 *   mediaType: "movie",
 * });
 * await newFavorite.save();
 *
 * // Query favorites for a user
 * const userFavorites = await Favorite.find({ userId: "603d2c5b2f8fb814b56f1d85" });
 *
 * // Remove a favorite
 * await Favorite.findOneAndDelete({ userId: "603d2c5b2f8fb814b56f1d85", tmdbId: "550" });
 * ```
 *
 * Security and Best Practices:
 * - Validate `userId` and `tmdbId` at the service/controller level to ensure integrity.
 * - Use the unique index on `userId` and `tmdbId` to maintain database consistency.
 * - Consider soft-deletion patterns (e.g., `isDeleted` field) if audit trails for removed favorites are required.
 *
 * Technologies:
 * - **Mongoose**: Provides schema-based modeling and built-in validation for MongoDB.
 * - **MongoDB**: Stores user-specific relationships for dynamic and scalable queries.
 *
 * Future Enhancements:
 * - Add support for tagging or categorizing favorites (e.g., "watchlist", "liked").
 * - Introduce optional fields like `reason` for tracking why a user added a favorite.
 * - Expand `mediaType` to include additional categories like "documentary" or "short".
 */

import mongoose from "mongoose";

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
