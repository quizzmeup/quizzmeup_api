const User = require("../../models/User");
const Submission = require("../../models/Submission");
const QuizVersion = require("../../models/QuizVersion");

// Retourne les utilisateurs de la cohorte ayant soumis une réponse à **n'importe quelle version** du quiz donné
const findUsersWithSubmissionsForCohort = async (quiz, cohortId) => {
  // 1. Récupérer les versions du quiz
  const versionIds = await quiz.getQuizVersionIds();
  if (versionIds.length === 0) return [];

  // 2. Récupérer les submissions associées à ces versions
  const submissions = await Submission.find({
    quizVersion: { $in: versionIds },
  }).select("user");

  const userIds = [...new Set(submissions.map((s) => s.user.toString()))];

  if (userIds.length === 0) return [];

  // 3. Récupérer les users appartenant à cette cohorte
  const users = await User.find({
    _id: { $in: userIds },
    cohorts: cohortId,
  }).select("name");

  // 4. Récupérer leur submission (une seule par user max à renvoyer)
  const submissionsByUser = await Submission.find({
    quizVersion: { $in: versionIds },
    user: { $in: users.map((u) => u._id) },
  }).sort({ createdAt: 1 });

  const submissionMap = new Map();
  for (const s of submissionsByUser) {
    const userId = s.user.toString();
    if (!submissionMap.has(userId)) {
      submissionMap.set(userId, s._id);
    }
  }

  // 5. Construire la réponse
  return users.map((u) => ({
    id: u._id,
    name: u.name,
    submissionId: submissionMap.get(u._id.toString()),
  }));
};

module.exports = findUsersWithSubmissionsForCohort;
