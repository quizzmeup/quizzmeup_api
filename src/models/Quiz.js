const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

QuizSchema.methods.latestVersion = function () {
  return mongoose
    .model("QuizVersion")
    .findOne({ quiz: this._id })
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model("Quiz", QuizSchema);
