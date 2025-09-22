import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Use environment variable with fallback
const JWT_SECRET = process.env.JWT_SECRET || "mitesh123@#$";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Get user from database excluding password
      const user = await User.findById(decoded.id).select("-password");
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      // Add user to request object
      req.user = user;
      next();
    } catch (err) {
      console.error("Token verification error:", err.message);
      
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }
      
      return res.status(401).json({ message: "Token is not valid" });
    }
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(500).json({ message: "Server error in authentication" });
  }
};

// Optional: Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};