import express from "express";
import Watchlist from "../../models/Watchlist.js";
import { protectRoute } from "../../middleware/authMiddleware.js";

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
