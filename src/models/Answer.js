const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
    },

    submittedAnswers: {
      type: [String],
      default: [],
    },

    score: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

AnswerSchema.methods.isCorrect = function () {
  return this.score > 0;
};

module.exports = mongoose.model("Answer", AnswerSchema);
