/**
 * Watchlist Model
 *
 * This module defines the schema and model for managing users' watchlist items
 * in the MongoDB database. It serves as a core component for tracking content
 * that users plan to watch, offering robust validation and indexing for data integrity.
 *
 * Key Features:
 * - **User-to-Content Mapping**:
 *   - Tracks the association between users and their watchlisted movies or TV shows.
 * - **Media Type Support**:
 *   - Differentiates between movies and TV shows with strict `enum` validation.
 * - **Automatic Timestamps**:
 *   - Utilizes Mongoose's `timestamps` option to record when items are added or updated.
 * - **Data Integrity**:
 *   - Enforces uniqueness of watchlist items per user via compound indexing on `userId` and `tmdbId`.
 * - **Scalability**:
 *   - Optimized for fast querying and prevents redundant entries in the watchlist.
 *
 * Schema Details:
 * - **Fields**:
 *   - `userId` (ObjectId, required): Links each watchlist entry to a specific user.
 *   - `tmdbId` (String, required): Identifies the movie or TV show in TMDb.
 *   - `mediaType` (String, required): Specifies whether the content is a "movie" or "tv" show.
 *   - `addedAt` (Date, optional): Automatically records when the item was added to the watchlist.
 * - **Timestamps**:
 *   - Automatically adds `createdAt` and `updatedAt` fields for lifecycle tracking.
 * - **Indexing**:
 *   - Prevents duplicate entries for the same user and content through a compound unique index on `userId` and `tmdbId`.
 *
 * Usage:
 * - **Content Tracking**:
 *   - Allow users to maintain a personalized list of content they plan to watch.
 * - **Engagement Analytics**:
 *   - Analyze trends in watchlisted content to optimize recommendations and user engagement.
 * - **Efficient Querying**:
 *   - Use indexed fields to quickly fetch, add, or remove watchlist items.
 *
 * Example Use Cases:
 * ```javascript
 * import Watchlist from './models/Watchlist.js';
 *
 * // Add an item to the user's watchlist
 * const newWatchlistItem = new Watchlist({
 *   userId: "user12345",
 *   tmdbId: "movie98765",
 *   mediaType: "movie",
 * });
 * await newWatchlistItem.save();
 *
 * // Retrieve all watchlist items for a specific user
 * const userWatchlist = await Watchlist.find({ userId: "user12345" });
 *
 * // Remove an item from the watchlist
 * await Watchlist.findOneAndDelete({ userId: "user12345", tmdbId: "movie98765" });
 *
 * // Prevent duplicate entries
 * try {
 *   const duplicateItem = new Watchlist({
 *     userId: "user12345",
 *     tmdbId: "movie98765",
 *     mediaType: "movie",
 *   });
 *   await duplicateItem.save();
 * } catch (error) {
 *   console.error("Duplicate watchlist entry prevented:", error.message);
 * }
 * ```
 *
 * Security and Best Practices:
 * - **Data Validation**:
 *   - Enforce strict validation on `tmdbId` and `mediaType` to avoid incorrect data entries.
 * - **Error Handling**:
 *   - Handle duplicate index errors gracefully to provide meaningful feedback to users.
 * - **Performance Optimization**:
 *   - Leverage indexing for efficient retrieval of user-specific watchlist data.
 * - **Scalable Architecture**:
 *   - Design the schema to accommodate additional fields in the future, such as `priority` or `notes`.
 *
 * Future Enhancements:
 * - **Watchlist Prioritization**:
 *   - Add fields like `priority` or `category` to enable sorting and grouping within watchlists.
 * - **Shared Watchlists**:
 *   - Support collaborative watchlists by allowing multiple users to share and contribute.
 * - **Integration with Content Models**:
 *   - Link watchlist items directly to content metadata for richer querying and UI display.
 *
 * Technologies:
 * - **Mongoose**: Provides schema validation, indexing, and robust query capabilities.
 * - **MongoDB**: Scales for handling large datasets of watchlists and user content interactions.
 *
 * Summary:
 * The `Watchlist` model is a foundational component for managing user engagement with planned content.
 * Its design ensures scalability, reliability, and alignment with modern user interaction patterns.
 */

import Watchlist from "../models/Watchlist.js";

/**
 * Get all watchlist items for the authenticated user.
 */
export const getWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ userId: req.user.id });
    res.json(watchlist);
  } catch (error) {
    console.error("Error fetching watchlist:", error.message);
    res.status(500).json({ error: "Failed to fetch watchlist." });
  }
};

/**
 * Add a new item to the user's watchlist.
 */
export const addToWatchlist = async (req, res) => {
  const { tmdbId, mediaType } = req.body;

  if (!tmdbId || !mediaType) {
    return res
      .status(400)
      .json({ error: "tmdbId and mediaType are required." });
  }

  try {
    // Check for duplicate entries
    const existingItem = await Watchlist.findOne({
      userId: req.user.id,
      tmdbId,
      mediaType,
    });

    if (existingItem) {
      return res
        .status(400)
        .json({ error: "Item is already in the watchlist." });
    }

    const watchlistItem = await Watchlist.create({
      userId: req.user.id,
      tmdbId,
      mediaType,
    });

    res.status(201).json(watchlistItem);
  } catch (error) {
    console.error("Error adding to watchlist:", error.message);
    res.status(500).json({ error: "Failed to add to watchlist." });
  }
};

/**
 * Remove an item from the user's watchlist.
 */
export const removeFromWatchlist = async (req, res) => {
  try {
    const watchlistItem = await Watchlist.findByIdAndDelete(req.params.id);

    if (!watchlistItem) {
      return res.status(404).json({ error: "Watchlist item not found." });
    }

    res.json({ message: "Watchlist item removed." });
  } catch (error) {
    console.error("Error removing watchlist item:", error.message);
    res.status(500).json({ error: "Failed to remove watchlist item." });
  }
};
