require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("./database");

const authRoutes = require("./routes/auth");
const progressRoutes = require("./routes/progress");
const budgetRoutes = require("./routes/budget");
const savingsRoutes = require("./routes/savings");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Rate limiting
app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

// Static files
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/savings", savingsRoutes);

// Health check
app.get("/api/health", async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  let userCount = 0;
  try {
    userCount = await require("./models/User").countDocuments();
  } catch (e) {}

  res.json({
    success: true,
    message: "MoneyDharma API running",
    database: dbStatus,
    totalUsers: userCount,
  });
});

// Page routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
["home", "onboarding", "dashboard", "learn", "tools", "schemes", "progress"].forEach((page) => {
  app.get(`/${page}`, (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
});

// Catch all
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ success: false, message: "Something went wrong" });
});

// START
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`
  🌱 ========================================
     MoneyDharma Server Running
     Port:     ${PORT}
     URL:      http://localhost:${PORT}
     API:      http://localhost:${PORT}/api/health
     Database: MongoDB Atlas ✅
  ========================================= 🌱
      `);
    });
  } catch (err) {
    console.error("❌ Server start failed:", err.message);
    process.exit(1);
  }
}

startServer();