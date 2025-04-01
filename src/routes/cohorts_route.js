const express = require("express");
const router = express.Router();
const cohorts_controller = require("../controllers/cohorts_controller");

router.get("/", cohorts_controller.getAllCohorts);
router.post("/", cohorts_controller.createCohort);

module.exports = router;
