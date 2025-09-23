import express from "express";
import Blog from "../models/Blog.js";

const router = express.Router();

// Create blog
router.post("/", async (req, res) => {
  try {
    const { title, content, image, author } = req.body;
    const blog = new Blog({ title, content, image, author });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to create blog", error });
  }
});

// Get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blogs", error });
  }
});

export default router;
