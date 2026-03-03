var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();

// ===== LOAD MODELS =====
var User;
var Session;
var Progress;

try {
  User = require("../models/User");
  console.log("✅ User model loaded");
} catch (err) {
  console.error("❌ Failed to load User model:", err.message);
}

try {
  Session = require("../models/Session");
  console.log("✅ Session model loaded");
} catch (err) {
  console.error("❌ Failed to load Session model:", err.message);
}

try {
  Progress = require("../models/Progress");
  console.log("✅ Progress model loaded");
} catch (err) {
  console.error("❌ Failed to load Progress model:", err.message);
}

// Load auth middleware
var auth = require("../middleware/auth");
var authenticateToken = auth.authenticateToken;
var JWT_SECRET = auth.JWT_SECRET;

// =============================================
// REGISTER
// =============================================
router.post("/register", async function(req, res) {
  try {
    var name = req.body.name;
    var phone = req.body.phone;
    var password = req.body.password;
    var profile = req.body.profile;
    var language = req.body.language;

    // Validate
    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, and password are required."
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 4 characters."
      });
    }

    // Check existing user
    var existing = await User.findOne({ phone: phone.trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Phone already registered. Please login."
      });
    }

    // Create user
    var user = new User({
      name: name.trim(),
      phone: phone.trim(),
      password: password,
      profile: profile || "general",
      language: language || "en"
    });
    await user.save();

    // Create progress
    var progress = new Progress({ userId: user._id });
    await progress.save();

    // Create token
    var token = jwt.sign(
      { userId: user._id.toString() },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Create session
    var session = new Session({
      userId: user._id,
      token: token,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    await session.save();

    return res.status(201).json({
      success: true,
      message: "Welcome to MoneyDharma!",
      data: {
        user: user.toJSON(),
        token: token
      }
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Phone already registered."
      });
    }
    return res.status(500).json({
      success: false,
      message: "Registration failed: " + err.message
    });
  }
});

// =============================================
// LOGIN
// =============================================
router.post("/login", async function(req, res) {
  try {
    var phone = req.body.phone;
    var password = req.body.password;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password required."
      });
    }

    // Find user - need password field for comparison
    var user = await User.findOne({ phone: phone.trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone or password."
      });
    }

    // Check password
    var isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone or password."
      });
    }

    // Remove old sessions
    await Session.deleteMany({ userId: user._id });

    // New token
    var token = jwt.sign(
      { userId: user._id.toString() },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    // New session
    var session = new Session({
      userId: user._id,
      token: token,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    await session.save();

    return res.json({
      success: true,
      message: "Welcome back!",
      data: {
        user: user.toJSON(),
        token: token
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: "Login failed: " + err.message
    });
  }
});

// =============================================
// LOGOUT
// =============================================
router.post("/logout", authenticateToken, async function(req, res) {
  try {
    await Session.deleteMany({ token: req.token });
    return res.json({ success: true, message: "Logged out." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Logout failed." });
  }
});

// =============================================
// GET ME
// =============================================
router.get("/me", authenticateToken, async function(req, res) {
  try {
    var user = await User.findById(req.user.id);
    var progress = await Progress.findOne({ userId: req.user.id });

    return res.json({
      success: true,
      data: {
        user: user ? user.toJSON() : null,
        progress: progress || null
      }
    });
  } catch (err) {
    console.error("GET ME ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed: " + err.message
    });
  }
});

// =============================================
// UPDATE PROFILE
// =============================================
router.put("/profile", authenticateToken, async function(req, res) {
  try {
    var updates = {};
    if (req.body.name) updates.name = req.body.name.trim();
    if (req.body.profile) updates.profile = req.body.profile;
    if (req.body.language) updates.language = req.body.language;

    var user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });

    return res.json({
      success: true,
      message: "Profile updated.",
      data: user.toJSON()
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Update failed." });
  }
});

module.exports = router;