/**
 * Genre Routes
 *
 * This module provides API endpoints for retrieving movie and TV genres
 * from the TMDb API. It uses caching to improve performance and reduce
 * redundant API calls.
 *
 * Endpoints:
 * - GET `/` - Retrieves movie and TV genres.
 *
 * Features:
 * - Utilizes `axios` for API requests to TMDb.
 * - Implements caching with `node-cache` to store genres for 1 hour.
 * - Logs errors using `winston`.
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
