import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String }, // optional image URL
    author: { type: String, default: "Anonymous" },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
