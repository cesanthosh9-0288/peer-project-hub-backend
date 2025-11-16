import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
  // Project being rated
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  // User who rated it
  userId: {
    type: String, // Firebase UID or temp ID
    required: true,
  },
  // Rating value (1-5)
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
}, { timestamps: true });

// Each user can only rate a project once
RatingSchema.index({ projectId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Rating", RatingSchema);