const { AppError, ConflictError } = require("../utils/errors");
const Cohort = require("../models/Cohort");

const getAllCohorts = async (req, res, next) => {
  res.status(200).json("ok");
};

const createCohort = async (req, res, next) => {
  const { name } = req.body;

  //check the parameter
  if (!req.body.name) {
    return next(new AppError("Missing required field: name"));
  }

  //check if cohort already exist
  const isCohortExist = await Cohort.findOne({ name });

  if (isCohortExist) {
    return next(new ConflictError("The cohort already exist"));
  }

  //create the new cohort and save it in DB
  const newCohort = new Cohort({ name });
  await newCohort.save();

  res.status(201).json(newCohort);
};

module.exports = { getAllCohorts, createCohort };
