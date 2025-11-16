import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  // Unique user ID (Firebase UID or temp ID from localStorage)
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  // Display name
  username: {
    type: String,
    required: true,
  },
  // User email
  email: {
    type: String,
  },
  // User bio
  bio: {
    type: String,
    default: "No bio added yet",
  },
}, { timestamps: true });

export default mongoose.model("User", UserSchema);