import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
  // Project being favorited
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  // User who favorited it
  userId: {
    type: String, // Firebase UID or temp ID
    required: true,
  },
}, { timestamps: true });

// Prevent duplicate favorites (user can't favorite same project twice)
FavoriteSchema.index({ projectId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Favorite", FavoriteSchema);