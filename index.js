import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import project from "./models/project.js";
import Comment from "./models/comment.js";
import Like from "./models/like.js";
import Rating from "./models/rating.js";
import Favorite from "./models/favorite.js";
import User from "./models/user.js";
import commentRoutes from "./routes/comment.js";
import favoriteRoutes from "./routes/favorite.js";
import ratingRoutes from "./routes/rating.js";
import userRoutes from "./routes/user.js";
import likeRoutes from "./routes/like.js";

// Load environment variables
dotenv.config();

const app = express();

// CORS always to be given before any routes 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register all routes (USER ROUTES FIRST)
app.use("/user", userRoutes);
app.use("/comment", commentRoutes);
app.use("/favorite", favoriteRoutes);
app.use("/rating", ratingRoutes);
app.use("/like", likeRoutes);

// MongoDB Atlas Connection
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/peer-project-hub";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB Error:", err));

// Setup credentials
const username = "San"
const password = "test1234"

// POST /login
app.post("/login", (req, res) => {
    if (req.body.username === username &&
        req.body.password === password) {
        res.send(true)
    }
    else {
        res.send(false)
    }
})

/* ============================================================
   1️⃣  ADD PROJECT  (POST /addproject)
============================================================ */
app.post("/addproject", async (req, res) => {
    try {
        const newProject = await project.create({
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags,
            link: req.body.link,
            live: req.body.live,
            authorName: req.body.authorName,
        });
        res.json({ success: true, data: newProject });
    } catch (err) {
        res.json({ success: false, data: err.message });
    }
});

/* ============================================================
   2️⃣  GET ALL PROJECTS  (GET /projects)
============================================================ */
app.get("/projects", async (req, res) => {
    try {
        const projects = await project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).send("Error fetching projects");
    }
});

/* ============================================================
   3️⃣  GET PROJECT BY ID  (GET /project/:id)
   Needed for Editing Page
============================================================ */
app.get("/project/:id", async (req, res) => {
    try {
        const item = await project.findById(req.params.id);
        res.json(item);
    } catch (err) {
        res.status(500).send("Error fetching project");
    }
});

/* ============================================================
   4️⃣  UPDATE PROJECT  (PUT /project/:id)
============================================================ */
app.put("/project/:id", async (req, res) => {
    try {
        const updatedProject = await project.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                description: req.body.description,
                tags: req.body.tags,
                link: req.body.link,
                live: req.body.live,
            },
            { new: true } // return updated version
        );
        res.json({ success: true, data: updatedProject });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

/* ============================================================
   5️⃣  DELETE PROJECT  (DELETE /project/:id)
============================================================ */
app.delete("/project/:id", async (req, res) => {
    try {
        await project.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Project deleted" });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

/* ============================================================
   📊 ANALYTICS  (GET /analytics)
============================================================ */
app.get("/analytics", async (req, res) => {
  try {
    console.log("📊 Fetching analytics data...");

    // 1. Total Projects
    const totalProjects = await project.countDocuments();

    // 2. Total Users
    const totalUsers = await User.countDocuments().catch(() => 0);

    // 3. Most Liked Project
    const mostLikedProject = await Like.aggregate([
      { $group: { _id: "$projectId", likeCount: { $sum: 1 } } },
      { $sort: { likeCount: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "projectDetails",
        },
      },
    ]).catch(() => []);

    // 4. Most Rated Project
    const mostRatedProject = await Rating.aggregate([
      { $group: { _id: "$projectId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
      { $sort: { avgRating: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "projectDetails",
        },
      },
    ]).catch(() => []);

    // 5. Total Comments
    const totalComments = await Comment.countDocuments().catch(() => 0);

    // 6. Total Likes
    const totalLikes = await Like.countDocuments().catch(() => 0);

    // 7. Total Ratings
    const totalRatings = await Rating.countDocuments().catch(() => 0);

    // 8. Total Favorites
    const totalFavorites = await Favorite.countDocuments().catch(() => 0);

    console.log("✅ Analytics data fetched successfully");

    res.json({
      success: true,
      data: {
        totalProjects,
        totalUsers,
        totalComments,
        totalLikes,
        totalRatings,
        totalFavorites,
        mostLikedProject: mostLikedProject.length > 0 ? mostLikedProject[0] : null,
        mostRatedProject: mostRatedProject.length > 0 ? mostRatedProject[0] : null,
      },
    });
  } catch (err) {
    console.error("❌ Analytics error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend server successfully started on port ${PORT}`);
});