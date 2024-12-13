/**
 * Trending Content Routes
 *
 * Overview:
 * This module defines an API endpoint for retrieving trending content from the TMDb API,
 * spanning both movies and TV shows. It is optimized for performance using in-memory caching
 * to minimize redundant external API requests and enhance response times.
 *
 * Features:
 * - **GET `/`**:
 *   - Retrieves the current trending content from TMDb's `/trending/all/day` endpoint.
 *   - Supports caching of API responses to reduce latency and API call overhead.
 * - **Caching**:
 *   - Uses `node-cache` with a TTL of 1 hour for caching trending content.
 *   - Prevents unnecessary requests to TMDb, especially during high-traffic periods.
 * - **Error Logging**:
 *   - Logs errors using `winston` for better visibility into API call failures or unexpected behaviors.
 *   - Differentiates between error levels (e.g., "error", "info") for effective debugging and monitoring.
 * - **Environment Variable Management**:
 *   - Uses `dotenv` to securely manage the TMDb access token and other sensitive configuration.
 *
 * Dependencies:
 * - **`axios`**:
 *   - For making HTTP requests to TMDb API.
 * - **`node-cache`**:
 *   - Implements lightweight in-memory caching.
 * - **`winston`**:
 *   - Provides structured logging for both development and production environments.
 *
 * Usage Example:
 * ```javascript
 * import express from "express";
 * import trendingRoutes from "./routes/trending.js";
 *
 * const app = express();
 * app.use("/api/trending", trendingRoutes);
 *
 * app.listen(3000, () => {
 *   console.log("Server running on port 3000");
 * });
 * ```
 *
 * Future Enhancements:
 * - **Custom Timeframes**:
 *   - Add support for weekly trending content by allowing query parameters like `time_window=week`.
 * - **Pagination**:
 *   - Include pagination support for returning paginated trending results.
 * - **Advanced Filters**:
 *   - Add filters for media types (`movie`, `tv`) to enhance user-specific recommendations.
 * - **Analytics**:
 *   - Integrate logging to track the most-requested trending content.
 *
 * Security:
 * - Ensures TMDb access token is never exposed to the client by handling all requests server-side.
 * - Implements robust error handling to avoid sensitive information leaks in API responses.
 */

import express from "express";
import axios from "axios";
import NodeCache from "node-cache";
import dotenv from "dotenv";
import winston from "winston";

dotenv.config();

const router = express.Router();
const cache = new NodeCache({ stdTTL: 3600 }); // 1-hour TTL
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

// Setup winston logger
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

// Define the / trending route
router.get("/", async (req, res) => {
  const cachedTrending = cache.get("trending");

  if (cachedTrending) {
    return res.json(cachedTrending);
  }

  try {
    const options = {
      method: "GET",
      url: "https://api.themoviedb.org/3/trending/all/day",
      params: { language: "en-US" },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    };

    const response = await axios.request(options);
    cache.set("trending", response.data);
    res.json(response.data);
  } catch (error) {
    logger.error("Error fetching trending data:", error.message);
    res.status(500).json({ message: "Failed to fetch trending data." });
  }
});

export default router;
