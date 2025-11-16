import express from "express";
import Comment from "../models/comment.js";

const router = express.Router();

// Create comment
router.post("/", async (req, res) => {
  try {
    const comment = await Comment.create(req.body);
    res.json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get comments for a project
router.get("/:projectId", async (req, res) => {
  try {
    const comments = await Comment.find({ projectId: req.params.projectId })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
