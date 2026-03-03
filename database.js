const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/moneydharma";

async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB Connected:", conn.connection.host);
    console.log("📦 Database:", conn.connection.name);

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB closed");
  process.exit(0);
});

module.exports = connectDB;