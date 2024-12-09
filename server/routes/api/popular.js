/**
 * Popular Movies and TV Shows Routes
 *
 * This module provides API endpoints for retrieving popular movies
 * and TV shows from the TMDb API. It uses caching to improve
 * performance and reduce redundant API calls.
 *
 * Endpoints:
 * - GET `/movies` - Retrieves popular movies.
 * - GET `/tv` - Retrieves popular TV shows.
 *
 * Features:
 * - Utilizes `axios` for API requests to TMDb.
 * - Implements caching with `node-cache` to store responses for 1 hour.
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
