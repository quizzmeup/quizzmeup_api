const { NotFoundError } = require("../utils/errors");
const Cohort = require("../models/Cohort");
const Quiz = require("../models/Quiz");
const findCohortsWithSubmissionsForQuiz = require("../services/cohorts/findCohortsWithSubmissionsForQuiz");

const getAllCohorts = async (req, res, next) => {
  //fecth all cohorts and get only _id and name field
  const allCohorts = await Cohort.find().sort({ createdAt: -1 });

  res.status(200).json(allCohorts);
};

const createCohort = async (req, res, next) => {
  const { name } = req.body;

  //create the new cohort and save it in DB
  const newCohort = new Cohort({ name });
  await newCohort.save();

  res.status(201).json(newCohort);
};

// GET /quizzes/:quizId/cohorts_with_submissions
getCohortsWithSubmissions = async (req, res, next) => {
  const { quizId } = req.params;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new NotFoundError("Quiz introuvable");

  const cohorts = await findCohortsWithSubmissionsForQuiz(quiz);

  res.json(cohorts);
};

module.exports = {
  getAllCohorts,
  createCohort,
  getCohortsWithSubmissions,
};
