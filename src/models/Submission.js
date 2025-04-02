const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cohort: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cohort",
      required: true,
    },

    quizVersion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizVersion",
      required: true,
    },

    startedAt: {
      type: Date,
    },

    submittedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", SubmissionSchema);
