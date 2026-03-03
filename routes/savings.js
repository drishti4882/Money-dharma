const express = require("express");
const router = express.Router();

// Import models
const Savings = require("../models/Savings");
const Progress = require("../models/Progress");

// Import middleware
const { authenticateToken } = require("../middleware/auth");

// =============================================
// CREATE SAVINGS GOAL — POST /api/savings
// =============================================
router.post("/", authenticateToken, async function (req, res) {
  try {
    var goalName = req.body.goalName;
    var targetAmount = req.body.targetAmount;
    var weeklyAmount = req.body.weeklyAmount;

    // Validate
    if (!goalName) {
      return res.status(400).json({
        success: false,
        message: "Goal name is required.",
      });
    }

    if (!targetAmount || targetAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Target amount must be greater than 0.",
      });
    }

    if (!weeklyAmount || weeklyAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Weekly savings must be greater than 0.",
      });
    }

    // Create savings goal
    var newGoal = new Savings({
      userId: req.user.id,
      goalName: goalName.trim(),
      targetAmount: parseFloat(targetAmount),
      weeklyAmount: parseFloat(weeklyAmount),
    });

    var savedGoal = await newGoal.save();

    // Update progress — increment goalsStarted
    var progress = await Progress.findOne({ userId: req.user.id });

    if (progress) {
      progress.goalsStarted = progress.goalsStarted + 1;
      progress.skillsLearned = Math.min(
        progress.lessonsCompleted + progress.goalsStarted,
        10
      );
      await progress.save();
    }

    return res.status(201).json({
      success: true,
      message: '"' + goalName + '" savings goal created!',
      data: {
        goal: savedGoal,
        timeline: {
          weeksNeeded: savedGoal.weeksNeeded,
          monthsNeeded: savedGoal.monthsNeeded,
        },
      },
    });
  } catch (err) {
    console.error("CREATE SAVINGS ERROR:", err.message);
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to create savings goal. Error: " + err.message,
    });
  }
});

// =============================================
// GET ALL SAVINGS GOALS — GET /api/savings
// =============================================
router.get("/", authenticateToken, async function (req, res) {
  try {
    var goals = await Savings.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    var totalGoals = goals.length;
    var activeGoals = 0;
    var completedGoals = 0;
    var totalSaved = 0;

    for (var i = 0; i < goals.length; i++) {
      if (goals[i].isCompleted) {
        completedGoals++;
      } else {
        activeGoals++;
      }
      totalSaved = totalSaved + (goals[i].savedSoFar || 0);
    }

    return res.json({
      success: true,
      data: goals,
      summary: {
        totalGoals: totalGoals,
        activeGoals: activeGoals,
        completedGoals: completedGoals,
        totalSaved: totalSaved,
      },
    });
  } catch (err) {
    console.error("GET SAVINGS ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch savings goals.",
    });
  }
});

// =============================================
// ADD CONTRIBUTION — POST /api/savings/:id/contribute
// =============================================
router.post("/:id/contribute", authenticateToken, async function (req, res) {
  try {
    var amount = req.body.amount;

    // Validate ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid savings goal ID.",
      });
    }

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid amount.",
      });
    }

    // Find the goal
    var goal = await Savings.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Savings goal not found.",
      });
    }

    // Add contribution
    goal.contributions.push({
      amount: parseFloat(amount),
      date: new Date(),
    });

    // Update saved amount
    goal.savedSoFar = goal.savedSoFar + parseFloat(amount);

    // Save (pre-save hook checks if completed)
    var updatedGoal = await goal.save();

    var remaining = updatedGoal.targetAmount - updatedGoal.savedSoFar;
    if (remaining < 0) remaining = 0;

    var percentComplete = 0;
    if (updatedGoal.targetAmount > 0) {
      percentComplete = Math.min(
        Math.round((updatedGoal.savedSoFar / updatedGoal.targetAmount) * 100),
        100
      );
    }

    var message = "";
    if (updatedGoal.isCompleted) {
      message = "🎉 Congratulations! Goal '" + updatedGoal.goalName + "' reached!";
    } else {
      message = "₹" + parseFloat(amount).toLocaleString("en-IN") + " added to '" + updatedGoal.goalName + "'";
    }

    return res.json({
      success: true,
      message: message,
      data: {
        goal: updatedGoal,
        percentComplete: percentComplete,
        remaining: remaining,
      },
    });
  } catch (err) {
    console.error("CONTRIBUTION ERROR:", err.message);
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to add contribution. Error: " + err.message,
    });
  }
});

// =============================================
// GET ONE GOAL — GET /api/savings/:id
// =============================================
router.get("/:id", authenticateToken, async function (req, res) {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID.",
      });
    }

    var goal = await Savings.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Savings goal not found.",
      });
    }

    return res.json({
      success: true,
      data: goal,
    });
  } catch (err) {
    console.error("GET GOAL ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch goal.",
    });
  }
});

// =============================================
// DELETE GOAL — DELETE /api/savings/:id
// =============================================
router.delete("/:id", authenticateToken, async function (req, res) {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID.",
      });
    }

    var goal = await Savings.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Savings goal not found.",
      });
    }

    return res.json({
      success: true,
      message: "Savings goal deleted.",
    });
  } catch (err) {
    console.error("DELETE GOAL ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete goal.",
    });
  }
});

module.exports = router;