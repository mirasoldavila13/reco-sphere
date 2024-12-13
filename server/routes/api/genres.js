/**
 * Genre Routes
 *
 * This module provides a streamlined API for retrieving movie and TV genres from the TMDb API.
 * It leverages caching mechanisms to optimize performance and reduce redundant API requests.
 * Designed with scalability and error resilience in mind, it integrates logging for monitoring
 * and debugging.
 *
 * Key Features:
 * - **Fetch TMDb Genres**:
 *   - Retrieves movie and TV genres from the TMDb API.
 *   - Supports real-time updates by querying the TMDb API on cache expiration.
 * - **Caching**:
 *   - Implements `node-cache` to store genre data for 1 hour (configurable).
 *   - Reduces API call volume and improves response times.
 * - **Logging**:
 *   - Uses `winston` for structured logging to file and console.
 *   - Logs errors and runtime information for better observability.
 * - **Concurrent Requests**:
 *   - Fetches movie and TV genres simultaneously using `Promise.all` for improved efficiency.
 *
 * Endpoints:
 * - `GET /api/genres/`:
 *   - Fetches movie and TV genres from the cache or TMDb API.
 *   - Responds with JSON containing `movieGenres` and `tvGenres`.
 *
 * Middleware:
 * - **Environment Configuration**:
 *   - Loads environment variables using `dotenv`.
 *   - Requires a valid `TMDB_ACCESS_TOKEN` in the `.env` file.
 *
 * Error Handling:
 * - **Cache Errors**:
 *   - If the cache is empty or expired, fetches fresh data from the TMDb API.
 * - **API Errors**:
 *   - Logs detailed error messages using `winston`.
 *   - Returns a `500 Internal Server Error` response with a user-friendly message.
 *
 * Dependencies:
 * - **`express`**: Framework for handling HTTP routes.
 * - **`axios`**: Makes HTTP requests to the TMDb API.
 * - **`node-cache`**: Implements in-memory caching for genre data.
 * - **`winston`**: Facilitates structured logging for runtime and error tracking.
 * - **`dotenv`**: Loads environment variables for secure API token management.
 *
 * Example Usage:
 * ```javascript
 * import express from "express";
 * import genreRoutes from "./routes/genres.js";
 *
 * const app = express();
 * app.use("/api/genres", genreRoutes);
 *
 * app.listen(3000, () => {
 *   console.log("Server running on port 3000");
 * });
 * ```
 *
 * Future Enhancements:
 * - **Localized Genres**:
 *   - Add support for dynamic language selection via query parameters.
 * - **Custom Cache TTL**:
 *   - Allow configurable cache durations through environment variables.
 * - **Extended TMDb Data**:
 *   - Incorporate additional TMDb genre-related information or analytics.
 */

import express from "express";
import axios from "axios";
import NodeCache from "node-cache";
import dotenv from "dotenv";
import winston from "winston";

dotenv.config();

const router = express.Router();
const cache = new NodeCache({ stdTTL: 3600 });
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

router.get("/", async (req, res) => {
  const cachedMovieGenres = cache.get("movieGenres");
  const cachedTVGenres = cache.get("tvGenres");

  if (cachedMovieGenres && cachedTVGenres) {
    return res.json({
      movieGenres: cachedMovieGenres,
      tvGenres: cachedTVGenres,
    });
  }

  try {
    const movieGenresOptions = {
      method: "GET",
      url: "https://api.themoviedb.org/3/genre/movie/list",
      params: { language: "en-US" },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    };

    const tvGenresOptions = {
      method: "GET",
      url: "https://api.themoviedb.org/3/genre/tv/list",
      params: { language: "en-US" },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    };

    // Fetch both movie and TV genres concurrently
    const [movieGenresResponse, tvGenresResponse] = await Promise.all([
      axios.request(movieGenresOptions),
      axios.request(tvGenresOptions),
    ]);

    const movieGenres = movieGenresResponse.data.genres;
    const tvGenres = tvGenresResponse.data.genres;

    //Cache the genres
    cache.set("movieGenres", movieGenres);
    cache.set("tvGenres", tvGenres);

    res.json({ movieGenres, tvGenres });
  } catch (error) {
    logger.error("Error fetching genres:", error.message);
    res.status(500).json({ message: "Failed to fetch genres." });
  }
});

export default router;
