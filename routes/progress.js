const express = require("express");
const Progress = require("../models/Progress");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();
const TOTAL_MODULES = 6;

// GET PROGRESS
router.get("/", authenticateToken, async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      progress = await Progress.create({ userId: req.user.id });
    }
    res.json({ success: true, data: progress });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch progress." });
  }
});

// COMPLETE LESSON
router.post("/complete-lesson", authenticateToken, async (req, res) => {
  try {
    const { moduleId, moduleName } = req.body;

    if (!moduleId) {
      return res.status(400).json({ success: false, message: "Module ID required." });
    }

    let progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      progress = await Progress.create({ userId: req.user.id });
    }

    const alreadyDone = progress.completedModules.some(
      (m) => m.moduleId === moduleId
    );

    if (alreadyDone) {
      return res.json({ success: true, message: "Already completed.", data: progress });
    }

    progress.completedModules.push({
      moduleId,
      moduleName: moduleName || "Unknown",
    });

    const lessons = progress.completedModules.length;
    const goals = progress.goalsStarted;

    progress.lessonsCompleted = lessons;
    progress.progressBasics = Math.min(Math.round((lessons / TOTAL_MODULES) * 100), 100);
    progress.progressSavings = Math.min(Math.round(((lessons + goals) / TOTAL_MODULES) * 80), 100);
    progress.progressDigital = Math.min(Math.round((lessons / TOTAL_MODULES) * 60), 100);
    progress.progressSchemes = Math.min(Math.round((lessons / TOTAL_MODULES) * 50), 100);
    progress.skillsLearned = Math.min(lessons + goals, 10);

    await progress.save();

    res.json({
      success: true,
      message: `Lesson completed! ${lessons} done.`,
      data: progress,
    });
  } catch (err) {
    console.error("Complete lesson error:", err);
    res.status(500).json({ success: false, message: "Failed to update." });
  }
});

// GET HISTORY
router.get("/history", authenticateToken, async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) return res.json({ success: true, data: [] });

    const history = [...progress.completedModules].sort(
      (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
    );

    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed." });
  }
});

// RESET
router.delete("/reset", authenticateToken, async (req, res) => {
  try {
    await Progress.findOneAndUpdate(
      { userId: req.user.id },
      {
        lessonsCompleted: 0,
        goalsStarted: 0,
        skillsLearned: 0,
        completedModules: [],
        progressBasics: 0,
        progressSavings: 0,
        progressDigital: 0,
        progressSchemes: 0,
      }
    );
    res.json({ success: true, message: "Progress reset." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Reset failed." });
  }
});

module.exports = router;