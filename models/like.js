import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
  // Project being liked
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  // User who liked it
  userId: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Each user can like a project only once
LikeSchema.index({ projectId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Like", LikeSchema);