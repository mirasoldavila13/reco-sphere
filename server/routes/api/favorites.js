import express from "express";
import Favorite from "../../models/Favorite.js";
import protectRoute from "../../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/favorites - Get all favorites for the authenticated user
router.get("/", protectRoute, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

// POST /api/favorites - Add a new favorite
router.post("/", protectRoute, async (req, res) => {
  const { tmdbId, mediaType } = req.body;

  if (!tmdbId || !mediaType) {
    return res.status(400).json({ error: "tmdbId and mediaType are required" });
  }

  try {
    const favorite = await Favorite.create({
      userId: req.user.id,
      tmdbId,
      mediaType,
    });
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

// DELETE /api/favorites/:id - Remove a favorite
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    await Favorite.findByIdAndDelete(req.params.id);
    res.json({ message: "Favorite removed" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

export default router;
