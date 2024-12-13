/**
 * Watchlist Routes
 *
 * Overview:
 * This module defines the API endpoints for managing users' watchlists. It allows
 * authenticated users to view, add, and remove items in their watchlist. These items
 * represent content (movies or TV shows) users want to track for future viewing.
 *
 * Key Endpoints:
 * - **GET `/`**:
 *   - Retrieves all watchlist items associated with the authenticated user.
 * - **POST `/`**:
 *   - Adds a new content item (movie or TV show) to the user's watchlist.
 * - **DELETE `/:id`**:
 *   - Removes a specific item from the user's watchlist by its unique identifier.
 *
 * Security:
 * - Implements JWT-based authentication to ensure only authorized users can access or
 *   modify their watchlist data.
 * - Uses the `protectRoute` middleware to verify and decode JWT tokens before accessing
 *   any endpoint.
 *
 * Features:
 * - **Data Validation**:
 *   - Ensures `tmdbId` (TMDb content identifier) and `mediaType` (e.g., "movie" or "tv")
 *     are provided when adding an item.
 * - **Error Handling**:
 *   - Responds with appropriate HTTP status codes and error messages for invalid input or
 *     server-side issues.
 * - **Scalability**:
 *   - Designed to scale with additional features such as pagination, filtering, or prioritization
 *     of watchlist items in the future.
 *
 * Dependencies:
 * - **`Watchlist` Model**:
 *   - Represents the schema for storing watchlist items in MongoDB.
 * - **`protectRoute` Middleware**:
 *   - Ensures that only authenticated users can access these endpoints.
 *
 * Usage Example:
 * ```javascript
 * import express from "express";
 * import watchlistRoutes from "./routes/api/watchlist.js";
 *
 * const app = express();
 * app.use("/api/watchlist", watchlistRoutes);
 *
 * app.listen(3000, () => {
 *   console.log("Server running on port 3000");
 * });
 * ```
 *
 * Potential Enhancements:
 * - **Pagination**:
 *   - Add support for paginated responses to handle large watchlists efficiently.
 * - **Sorting and Filtering**:
 *   - Allow users to sort by `addedAt` date or filter by `mediaType` (e.g., only movies or TV shows).
 * - **Prioritization**:
 *   - Enable users to set priority levels or categories within their watchlist.
 * - **Batch Operations**:
 *   - Support batch additions or deletions for improved usability.
 * - **Watchlist Analytics**:
 *   - Provide insights like "most added items" or "watchlist trends."
 */

import express from "express";
import Watchlist from "../../models/Watchlist.js";
import protectRoute from "../../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/watchlist - Get all watchlist items for the authenticated user
router.get("/", protectRoute, async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ userId: req.user.id });
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
});

// POST /api/watchlist - Add a new watchlist item
router.post("/", protectRoute, async (req, res) => {
  const { tmdbId, mediaType } = req.body;

  if (!tmdbId || !mediaType) {
    return res.status(400).json({ error: "tmdbId and mediaType are required" });
  }

  try {
    const watchlistItem = await Watchlist.create({
      userId: req.user.id,
      tmdbId,
      mediaType,
    });
    res.status(201).json(watchlistItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to add to watchlist" });
  }
});

// DELETE /api/watchlist/:id - Remove a watchlist item
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    await Watchlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Watchlist item removed" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove watchlist item" });
  }
});

export default router;
