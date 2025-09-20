import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";

// Hardcoded config
const PORT = 5000;
const MONGO_URI = "mongodb://127.0.0.1:27017/Blogs";

// Connect to MongoDB
connectDB(MONGO_URI);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Default route
app.get("/", (req, res) => res.send("API running"));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
