const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

QuizSchema.statics.withPublishedVersions = async function (filters) {
  const quizIds = await mongoose
    .model("QuizVersion")
    .distinct("quiz", { isPublished: true });

  return this.find({
    _id: { $in: quizIds },
    ...filters,
  });
};

QuizSchema.methods.latestVersion = async function () {
  return await mongoose
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

QuizSchema.methods.latestPublishedVersion = async function () {
  return await mongoose
    .model("QuizVersion")
    .findOne({ quiz: this._id, isPublished: true })
    .sort({
      createdAt: -1,
    });
};

module.exports = mongoose.model("Quiz", QuizSchema);
