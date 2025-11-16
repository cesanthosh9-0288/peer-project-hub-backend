import express from "express";
import Favorite from "../models/favorite.js";

const router = express.Router();

// Add to favorites
router.post("/", async (req, res) => {
  try {
    const favorite = await Favorite.create(req.body);
    res.json(favorite);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Remove from favorites
router.delete("/:projectId/:userId", async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      projectId: req.params.projectId,
      userId: req.params.userId,
    });
    res.json({ success: true, message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get user's favorites
router.get("/:userId", async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId })
      .populate("projectId")
      .sort({ createdAt: -1 });
    res.json(favorites);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Check if project is favorited by user
router.get("/check/:projectId/:userId", async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      projectId: req.params.projectId,
      userId: req.params.userId,
    });
    res.json({ isFavorited: !!favorite });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;