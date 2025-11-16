import express from "express";
import Like from "../models/like.js";

const router = express.Router();

// Add like (or remove if already liked)
router.post("/", async (req, res) => {
  try {
    const existingLike = await Like.findOne({
      projectId: req.body.projectId,
      userId: req.body.userId,
    });

    if (existingLike) {
      // Remove like
      await Like.findByIdAndDelete(existingLike._id);
      res.json({ success: true, liked: false, message: "Like removed" });
    } else {
      // Add like
      const like = await Like.create(req.body);
      res.json({ success: true, liked: true, data: like });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get like count for a project
router.get("/:projectId", async (req, res) => {
  try {
    const likes = await Like.find({ projectId: req.params.projectId });
    res.json({
      likeCount: likes.length,
      likes: likes,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Check if user liked a project
router.get("/check/:projectId/:userId", async (req, res) => {
  try {
    const like = await Like.findOne({
      projectId: req.params.projectId,
      userId: req.params.userId,
    });
    
    res.json({
      isLiked: !!like,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;