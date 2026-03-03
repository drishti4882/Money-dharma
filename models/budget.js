var mongoose = require("mongoose");

var budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  income: {
    type: Number,
    required: true
  },
  expenses: [
    {
      name: { type: String, required: true },
      amount: { type: Number, required: true }
    }
  ],
  totalExpenses: {
    type: Number,
    default: 0
  },
  remaining: {
    type: Number,
    default: 0
  },
  period: {
    type: String,
    default: "monthly"
  },
  isPositive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate totals before saving
budgetSchema.pre("save", function(next) {
  var total = 0;
  for (var i = 0; i < this.expenses.length; i++) {
    total = total + this.expenses[i].amount;
  }
  this.totalExpenses = total;
  this.remaining = this.income - total;
  this.isPositive = this.remaining >= 0;
  next();
});

var Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;