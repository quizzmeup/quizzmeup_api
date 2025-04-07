const User = require("../models/User");
const Quiz = require("../models/Quiz");
const { NotFoundError } = require("../utils/errors");
const findUsersWithSubmissionsForCohort = require("../services/users/findUsersWithSubmissionsForCohort");

const UsersController = {
  getUsers: async (req, res) => {
    let name = req.query.name;
    const filters = {};

    if (name) {
      filters.name = new RegExp(name, "i");
    }

    const users = await User.find(filters)
      .select("_id email name isAdmin")
      .populate("cohorts", "name");

    res.status(200).json(users);
  },

  getUsersWithSubmissionsForCohort: async (req, res) => {
    const { quizId, cohortId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new NotFoundError("Quiz introuvable");

    const users = await findUsersWithSubmissionsForCohort(quiz, cohortId);
    res.json(users);
  },
};

module.exports = UsersController;
