const express = require("express");
const router = express.Router();

// Import model
const Budget = require("../models/Budget");

// Import middleware
const { authenticateToken } = require("../middleware/auth");

// =============================================
// SAVE BUDGET — POST /api/budget
// =============================================
router.post("/", authenticateToken, async function (req, res) {
  try {
    var income = req.body.income;
    var expenses = req.body.expenses;
    var period = req.body.period;

    // Validate income
    if (!income || income <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid income amount.",
      });
    }

    // Clean expenses array
    var cleanExpenses = [];

    if (expenses && Array.isArray(expenses)) {
      for (var i = 0; i < expenses.length; i++) {
        var exp = expenses[i];
        var expName = (exp.name && exp.name.trim()) ? exp.name.trim() : "Other";
        var expAmount = parseFloat(exp.amount) || 0;

        if (expAmount > 0) {
          cleanExpenses.push({
            name: expName,
            amount: expAmount,
          });
        }
      }
    }

    // Create budget document
    var newBudget = new Budget({
      userId: req.user.id,
      income: parseFloat(income),
      expenses: cleanExpenses,
      period: period || "monthly",
    });

    // Save to database
    var savedBudget = await newBudget.save();

    // Create tips
    var tips = [];
    if (savedBudget.isPositive) {
      tips.push("You can save ₹" + savedBudget.remaining.toLocaleString("en-IN"));
      if (savedBudget.remaining / savedBudget.income >= 0.2) {
        tips.push("Great! You are saving more than 20%.");
      } else {
        tips.push("Try the 50-30-20 rule for better savings.");
      }
    } else {
      tips.push("Expenses exceed income by ₹" + Math.abs(savedBudget.remaining).toLocaleString("en-IN"));
      tips.push("Try reducing non-essential expenses.");
    }

    return res.status(201).json({
      success: true,
      message: savedBudget.isPositive ? "You have room to save!" : "Expenses are too high.",
      data: {
        budget: savedBudget,
        summary: {
          income: savedBudget.income,
          totalExpenses: savedBudget.totalExpenses,
          remaining: savedBudget.remaining,
          isPositive: savedBudget.isPositive,
        },
        tips: tips,
      },
    });
  } catch (err) {
    console.error("BUDGET SAVE ERROR:", err.message);
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to save budget. Error: " + err.message,
    });
  }
});

// =============================================
// GET ALL BUDGETS — GET /api/budget
// =============================================
router.get("/", authenticateToken, async function (req, res) {
  try {
    var budgets = await Budget.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({
      success: true,
      data: budgets,
      count: budgets.length,
    });
  } catch (err) {
    console.error("GET BUDGETS ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch budgets.",
    });
  }
});

// =============================================
// GET ONE BUDGET — GET /api/budget/:id
// =============================================
router.get("/:id", authenticateToken, async function (req, res) {
  try {
    // Validate ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid budget ID.",
      });
    }

    var budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found.",
      });
    }

    return res.json({
      success: true,
      data: budget,
    });
  } catch (err) {
    console.error("GET BUDGET ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch budget.",
    });
  }
});

// =============================================
// DELETE BUDGET — DELETE /api/budget/:id
// =============================================
router.delete("/:id", authenticateToken, async function (req, res) {
  try {
    // Validate ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid budget ID.",
      });
    }

    var budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found.",
      });
    }

    return res.json({
      success: true,
      message: "Budget deleted.",
    })
    
  } catch (err) {
    console.error("DELETE BUDGET ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete budget.",
    });
  }
});

module.exports = router;