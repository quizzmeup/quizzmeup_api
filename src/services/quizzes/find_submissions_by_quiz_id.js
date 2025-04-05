const QuizVersion = require("../../models/QuizVersion");
const Submission = require("../../models/Submission");

const findSubmissionsByQuizIdForUser = async (quizzes, userId) => {
  const quizIds = quizzes.map((q) => q._id);

  const versions = await QuizVersion.find({
    quiz: { $in: quizIds },
    isPublished: true,
  });

  const versionMap = new Map(); // quizId => [versionIds]
  versions.forEach((v) => {
    const key = v.quiz.toString();
    const current = versionMap.get(key) || [];
    current.push(v._id.toString());
    versionMap.set(key, current);
  });

  const versionIds = versions.map((v) => v._id);
  const submissions = await Submission.find({
    quizVersion: { $in: versionIds },
    user: userId,
  });

  const submissionMap = new Map(); // quizId => submissionId
  submissions.forEach((s) => {
    const version = versions.find(
      (v) => v._id.toString() === s.quizVersion.toString()
    );
    const quizId = version?.quiz?.toString();
    if (quizId && !submissionMap.has(quizId)) {
      submissionMap.set(quizId, s._id.toString());
    }
  });

  return submissionMap;
};

module.exports = findSubmissionsByQuizIdForUser;
