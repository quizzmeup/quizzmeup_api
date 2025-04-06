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

QuizSchema.methods.getQuizVersionIds = async function () {
  const versions = await mongoose
    .model("QuizVersion")
    .find({ quiz: this._id })
    .select("_id");

  return versions.map((v) => v._id);
};

module.exports = mongoose.model("Quiz", QuizSchema);
