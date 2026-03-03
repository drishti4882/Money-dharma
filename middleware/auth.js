const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Session = require("../models/Session");

const JWT_SECRET = process.env.JWT_SECRET || "moneydharma_secret_key_2025";

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please login first.",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    const session = await Session.findOne({ token, userId: user._id });
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      phone: user.phone,
      email: user.email,
      profile: user.profile,
      language: user.language,
    };
    req.token = token;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired.",
      });
    }
    return res.status(403).json({
      success: false,
      message: "Invalid token.",
    });
  }
}

module.exports = { authenticateToken, JWT_SECRET };