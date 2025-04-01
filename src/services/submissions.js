const Submission = require("../models/Submission");
const Quiz = require("../models/Quiz");
const QuizVersion = require("../models/QuizVersion");
const Answer = require("../models/Answer");
const User = require("../models/User");
const Cohort = require("../models/Cohort");
const prepareAnswersWithScore = require("./answers/prepareAnswersWithScore");
const computeSubmissionScores = require("./aggregates/submissionScores");

const { NotFoundError, ConflictError } = require("../utils/errors");

module.exports = {
  // GET /api/users/:user_id/submissions
  async fetchUserSubmissions(userId) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("Utilisateur introuvable");

    const submissions = await Submission.find({ user: user._id })
      .populate("quizVersion", "title quiz")
      .populate("cohort", "name")
      .populate("user", "name")
      .lean();

    const scoreMap = await computeSubmissionScores(submissions);

    return submissions.map((s) => ({
      ...s,
      score: scoreMap[s._id.toString()] || 0,
    }));
  },

  // GET /api/quizzes/:quiz_id/submissions
  async fetchQuizSubmissions(quizId) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new NotFoundError("Quiz introuvable");

    const versions = await QuizVersion.find({ quiz: quiz._id });
    const versionIds = versions.map((v) => v._id);

    const submissions = await Submission.find({
      quizVersion: { $in: versionIds },
    })
      .populate("user", "name")
      .populate("cohort", "name")
      .populate("quizVersion", "title")
      .lean();

    const scoreMap = await computeSubmissionScores(submissions);

    return submissions.map((s) => ({
      ...s,
      score: scoreMap[s._id.toString()] || 0,
    }));
  },

  // GET /api/submissions/:id
  async fetchSubmissionWithAnswers(submissionId) {
    const submission = await Submission.findById(submissionId)
      .populate("quizVersion", "title")
      .populate("user", "name")
      .populate("cohort", "name");

    if (!submission) throw new NotFoundError("Soumission introuvable");

    const answers = await Answer.find({ submission: submission._id }).populate(
      "question",
      "title points rightAnswers propositions"
    );

    return {
      ...submission.toObject(),
      answers: answers.map((a) => ({
        question: a.question,
        submittedAnswers: a.submittedAnswers,
        score: a.score,
      })),
    };
  },

  // POST /api/quizzes/:quiz_version_id/submissions
  async createSubmissionWithAnswers({
    user,
    quizVersionId,
    cohortId,
    answersPayload,
  }) {
    await assertQuizVersionExists(quizVersionId);
    await assertCohortExists(cohortId);
    await assertSubmissionNotExists(user, quizVersionId, cohortId);

    const submission = new Submission({
      user,
      quizVersion: quizVersionId,
      cohort: cohortId,
      submittedAt: new Date(),
    });

    const computedAnswers = await prepareAnswersWithScore(
      submission,
      answersPayload
    );

    await submission.save();
    const insertedAnswers = await Answer.insertMany(computedAnswers);

    return {
      ...submission.toObject(),
      answers: insertedAnswers.map((a) => ({
        question: a.question,
        submittedAnswers: a.submittedAnswers,
        score: a.score,
      })),
    };
  },
};

async function assertQuizVersionExists(quizVersionId) {
  const exists = await QuizVersion.exists({ _id: quizVersionId });
  if (!exists) throw new NotFoundError("Version du quiz introuvable");
}

async function assertCohortExists(cohortId) {
  const exists = await Cohort.exists({ _id: cohortId });
  if (!exists) throw new NotFoundError("Cohorte introuvable");
}

async function assertSubmissionNotExists(user, quizVersionId, cohortId) {
  const exists = await Submission.exists({
    user,
    quizVersion: quizVersionId,
    cohort: cohortId,
  });
  if (exists) {
    throw new ConflictError(
      "Vous avez déjà soumis ce quiz pour cette cohorte."
    );
  }
}
