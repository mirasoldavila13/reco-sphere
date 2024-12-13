/**
 * Popular Movies and TV Shows Routes
 *
 * Overview:
 * This module defines API endpoints for fetching and caching popular movies and TV shows
 * from the TMDb API. It is optimized for performance with in-memory caching and
 * designed for scalability and fault tolerance in real-world applications.
 *
 * Features:
 * - **Popular Movies**:
 *   - Endpoint: `GET /api/popular/movies`
 *   - Fetches a paginated list of popular movies from TMDb.
 *   - Caches results in memory for 1 hour to reduce API call frequency.
 * - **Popular TV Shows**:
 *   - Endpoint: `GET /api/popular/tv`
 *   - Fetches a paginated list of popular TV shows from TMDb.
 *   - Utilizes the same caching mechanism for efficiency.
 *
 * Caching:
 * - In-memory caching implemented with `node-cache`:
 *   - Stores responses for a Time-To-Live (TTL) of 1 hour.
 *   - Significantly reduces redundant requests to TMDb, lowering API rate limits usage.
 *
 * API Integration:
 * - The module queries TMDb's `/movie/popular` and `/tv/popular` endpoints.
 * - Pagination support can be extended by adding dynamic `page` query parameters.
 *
 * Error Handling:
 * - Handles TMDb API failures gracefully:
 *   - Logs error messages for debugging.
 *   - Sends an HTTP 500 response with a descriptive error message.
 * - Fallback mechanisms could be implemented for high availability (e.g., retries or backup data).
 *
 * Dependencies:
 * - **`express`**: Provides HTTP routing for the module.
 * - **`axios`**: Handles external API requests to TMDb.
 * - **`node-cache`**: Implements fast in-memory caching for responses.
 * - **`dotenv`**: Manages sensitive configuration data (e.g., API tokens).
 *
 * Usage Example:
 * ```javascript
 * import express from "express";
 * import popularRoutes from "./routes/popular.js";
 *
 * const app = express();
 * app.use("/api/popular", popularRoutes);
 *
 * app.listen(3000, () => {
 *   console.log("Server running on port 3000");
 * });
 * ```
 *
 * Future Improvements:
 * - **Pagination**:
 *   - Enable dynamic pagination through query parameters (e.g., `?page=2`).
 * - **Localization**:
 *   - Add support for localized content with `language` query parameters.
 * - **Extended Data Caching**:
 *   - Implement distributed caching (e.g., Redis) for scalability in multi-instance deployments.
 * - **Fallback Data**:
 *   - Serve cached fallback data during API outages.
 */

import express from "express";
import axios from "axios";
import NodeCache from "node-cache";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const cache = new NodeCache({ stdTTL: 3600 }); // 1-hour TTL
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

router.get("/movies", async (req, res) => {
  const cachedMovies = cache.get("popularMovies");
  if (cachedMovies) {
    return res.json(cachedMovies);
  }

  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/movie/popular",
      {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          accept: "application/json",
        },
        params: { language: "en-US", page: 1 },
      },
    );

    const popularMovies = response.data;
    cache.set("popularMovies", popularMovies);
    res.json(popularMovies);
  } catch (error) {
    console.error("Error fetching popular movies:", error.message);
    res.status(500).json({ error: "Failed to fetch popular movies." });
  }
});

router.get("/tv", async (req, res) => {
  const cachedTVShows = cache.get("popularTV");
  if (cachedTVShows) {
    return res.json(cachedTVShows);
  }

  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/tv/popular",
      {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          accept: "application/json",
        },
        params: { language: "en-US", page: 1 },
      },
    );

    const popularTVShows = response.data;
    cache.set("popularTV", popularTVShows);
    res.json(popularTVShows);
  } catch (error) {
    console.error("Error fetching popular TV shows:", error.message);
    res.status(500).json({ error: "Failed to fetch popular TV shows." });
  }
});

export default router;
