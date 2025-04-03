const Answer = require("../../models/Answer");

module.exports = async function computeSubmissionScores(submissions) {
  const submissionIds = submissions.map((s) => s._id);

  const scores = await Answer.aggregate([
    { $match: { submission: { $in: submissionIds } } },
    {
      $group: {
        _id: "$submission",
        score: { $sum: "$score" },
      },
    },
  ]);

  // Retourne un dictionnaire des scores
  return Object.fromEntries(scores.map((s) => [s._id.toString(), s.score]));
};
