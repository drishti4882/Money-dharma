var mongoose = require("mongoose");

var savingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  goalName: {
    type: String,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  weeklyAmount: {
    type: Number,
    required: true
  },
  savedSoFar: {
    type: Number,
    default: 0
  },
  weeksNeeded: {
    type: Number,
    default: 0
  },
  monthsNeeded: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  contributions: [
    {
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now }
    }
  ]
}, {
  timestamps: true
});

// Calculate weeks and months before saving
savingsSchema.pre("save", function(next) {
  if (this.targetAmount && this.weeklyAmount) {
    this.weeksNeeded = Math.ceil(this.targetAmount / this.weeklyAmount);
    this.monthsNeeded = parseFloat((this.weeksNeeded / 4.33).toFixed(1));
  }
  if (this.savedSoFar >= this.targetAmount) {
    this.isCompleted = true;
  }
  next();
});

var Savings = mongoose.model("Savings", savingsSchema);

module.exports = Savings;