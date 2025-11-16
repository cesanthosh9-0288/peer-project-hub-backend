import express from "express";
import User from "../models/user.js";
import Project from "../models/project.js";

const router = express.Router();

// Create or update user profile
router.post("/", async (req, res) => {
  try {
    console.log("POST /user received:", req.body);
    
    let user = await User.findOne({ userId: req.body.userId });
    console.log("Existing user:", user);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.bio = req.body.bio || user.bio;
      await user.save();
      console.log("User updated:", user);
    } else {
      user = await User.create(req.body);
      console.log("New user created:", user);
    }

    res.json(user);
  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get user profile by userId
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    res.json(user || { message: "User not found" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get user's projects
router.get("/:userId/projects", async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;