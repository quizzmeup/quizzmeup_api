const mongoose = require("mongoose");

const QuizVersionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    durationInMinutes: { type: Number, required: true },
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

module.exports = mongoose.model("QuizVersion", QuizVersionSchema);
