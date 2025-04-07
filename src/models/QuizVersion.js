const mongoose = require("mongoose");

const QuizVersionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    durationInMinutes: { type: Number },
    isPublished: { type: Boolean, default: false },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
  },
  { timestamps: true }
);

QuizVersionSchema.methods.getQuestions = async function () {
  return await mongoose.model("Question").find({ quizVersion: this._id });
};

QuizVersionSchema.methods.questionsCount = async function () {
  return await mongoose
    .model("Question")
    .countDocuments({ quizVersion: this._id });
};

module.exports = mongoose.model("QuizVersion", QuizVersionSchema);
