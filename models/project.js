import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    tags: [String],
    link: String,
    live: String,
    userId: {
        type: String,
        required: "Anonymous",
    },
    authorName: {
        type: String,
        default: "Anonymous",
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Project", ProjectSchema);
