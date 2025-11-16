import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  userId: {
    type: String, // Firebase UID
    required: true,
  },
  username: {
    type: String, // display name or email
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Comment", CommentSchema);
