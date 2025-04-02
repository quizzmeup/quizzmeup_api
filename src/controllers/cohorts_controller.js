const { AppError, ConflictError, NotFoundError } = require("../utils/errors");
const Cohort = require("../models/Cohort");

const getAllCohorts = async (req, res, next) => {
  //fecth all cohorts and get only _id and name field
  const allCohorts = await Cohort.find({}, "_id, name");

  res.status(200).json(allCohorts);
};

const createCohort = async (req, res, next) => {
  const { name } = req.body;

  //create the new cohort and save it in DB
  const newCohort = new Cohort({ name });
  await newCohort.save();

  res.status(201).json(newCohort);
};

module.exports = { getAllCohorts, createCohort };
