const express = require("express");
const router = express.Router();
const cohorts_controller = require("../controllers/cohorts_controller");
const asyncHandler = require("../middlewares/async-handler");

router.get("/", asyncHandler(cohorts_controller.getAllCohorts));
router.post("/", asyncHandler(cohorts_controller.createCohort));

module.exports = router;
