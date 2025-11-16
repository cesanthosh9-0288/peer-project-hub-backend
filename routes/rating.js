import express from "express";
import Rating from "../models/rating.js";

const router = express.Router();

// Add or update rating
router.post("/", async (req, res) => {
  try {
    // Check if user already rated this project
    const existingRating = await Rating.findOne({
      projectId: req.body.projectId,
      userId: req.body.userId,
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = req.body.rating;
      await existingRating.save();
      res.json(existingRating);
    } else {
      // Create new rating
      const rating = await Rating.create(req.body);
      res.json(rating);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all ratings for a project
router.get("/:projectId", async (req, res) => {
  try {
    const ratings = await Rating.find({ projectId: req.params.projectId });
    
    // Calculate average rating
    const avgRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : 0;

    res.json({
      ratings: ratings,
      avgRating: avgRating,
      totalRatings: ratings.length,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get user's rating for a project
router.get("/check/:projectId/:userId", async (req, res) => {
  try {
    const rating = await Rating.findOne({
      projectId: req.params.projectId,
      userId: req.params.userId,
    });
    
    res.json({
      hasRated: !!rating,
      rating: rating ? rating.rating : 0,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;