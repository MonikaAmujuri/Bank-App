import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import { authorizeRoles } from "./middleware/roleMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userLoanRoutes from "./routes/userLoanRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import path from "path";

// Load .env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Debug: Check if URI is loaded
console.log("Mongo URI Loaded:", process.env.MONGO_URI ? "YES ✅" : "NO ❌");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userLoanRoutes);
app.use("/api/agent", agentRoutes);
app.use("/uploads", express.static(path.resolve("uploads")));

// Protected Admin Route
app.get(
  "/api/admin-only",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin 🔥" });
  }
);

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 Bank Backend API Running...");
});

// ---------------------------------------
// ✅ Proper MongoDB Connection Handling
// ---------------------------------------

mongoose.set("strictQuery", false);

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    console.log("🔄 Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully");
    console.log("Connected DB Name:", mongoose.connection.name);
    console.log("Connected Host:", mongoose.connection.host);

    app.listen(PORT, () => {
      console.log(`🔥 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ MongoDB Connection Failed:");
    console.error(error.message);
    process.exit(1); // Stop app completely if DB fails
  }
};

startServer();