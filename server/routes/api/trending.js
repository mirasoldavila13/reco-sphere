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
