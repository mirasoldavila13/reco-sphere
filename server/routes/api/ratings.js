import express from "express";
import Rating from "../../models/Rating.js";
import { protectRoute } from "../../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/ratings - Get all ratings for the authenticated user
router.get("/", protectRoute, async (req, res) => {
  try {
    const ratings = await Rating.find({ userId: req.user.id });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ratings" });
  }
});

// POST /api/ratings - Add or update a rating
router.post("/", protectRoute, async (req, res) => {
  const { tmdbId, rating } = req.body;

  if (!tmdbId || typeof rating !== "number") {
    return res
      .status(400)
      .json({ error: "tmdbId and rating (0-10) are required" });
  }

  try {
    const existingRating = await Rating.findOne({
      userId: req.user.id,
      tmdbId,
    });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      return res.json(existingRating);
    }

    const newRating = await Rating.create({
      userId: req.user.id,
      tmdbId,
      rating,
    });
    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ error: "Failed to add/update rating" });
  }
});

// DELETE /api/ratings/:id - Remove a rating
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    await Rating.findByIdAndDelete(req.params.id);
    res.json({ message: "Rating removed" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove rating" });
  }
});

export default router;
