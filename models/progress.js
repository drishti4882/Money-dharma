var mongoose = require("mongoose");

var progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  lessonsCompleted: {
    type: Number,
    default: 0
  },
  goalsStarted: {
    type: Number,
    default: 0
  },
  skillsLearned: {
    type: Number,
    default: 0
  },
  completedModules: [
    {
      moduleId: { type: String },
      moduleName: { type: String },
      completedAt: { type: Date, default: Date.now }
    }
  ],
  progressBasics: { type: Number, default: 0 },
  progressSavings: { type: Number, default: 0 },
  progressDigital: { type: Number, default: 0 },
  progressSchemes: { type: Number, default: 0 }
}, {
  timestamps: true
});

var Progress = mongoose.model("Progress", progressSchema);

module.exports = Progress;