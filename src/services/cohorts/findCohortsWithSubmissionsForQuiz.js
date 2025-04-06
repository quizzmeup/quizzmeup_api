const Submission = require("../../models/Submission");
const User = require("../../models/User");
const Cohort = require("../../models/Cohort");

const findCohortsWithSubmissionsForQuiz = async (quiz) => {
  // 1. Récupérer les IDs des versions publiées du quiz via la méthode d'instance
  const versionIds = await quiz.getQuizVersionIds();

  // 2. Récupérer les userIds ayant soumis pour l'une de ces versions
  const userIds = await Submission.distinct("user", {
    quizVersion: { $in: versionIds },
  });

  if (userIds.length === 0) return [];

  // 3. Extraire directement les cohort IDs distincts parmi ces users
  const cohortIds = await User.distinct("cohorts", { _id: { $in: userIds } });
  if (cohortIds.length === 0) return [];

  // 4. Récupérer les cohortes correspondantes (le service retourne les objets Mongoose bruts)
  const cohorts = await Cohort.find({ _id: { $in: cohortIds } });

  return cohorts;
};

module.exports = findCohortsWithSubmissionsForQuiz;
