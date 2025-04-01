const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    markdownCode: { type: String, default: "" },
    points: { type: Number, required: true },

    rightAnswers: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Le champ rightAnswers doit contenir au moins une réponse.",
      },
    },

    propositions: {
      type: [String],
      default: [],
    },

    multipleChoices: { type: Boolean, required: true },

    quizVersion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizVersion",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", QuestionSchema);
