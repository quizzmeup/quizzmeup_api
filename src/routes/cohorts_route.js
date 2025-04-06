const express = require("express");
const router = express.Router();
const cohortsController = require("../controllers/cohorts_controller");
const asyncHandler = require("../middlewares/async-handler");
const authMiddleware = require("../middlewares/auth_middleware");
const adminOnly = require("../middlewares/admin_only");

router.use(authMiddleware);

router.get("/cohorts", asyncHandler(cohortsController.getAllCohorts));
router.post(
  "/cohorts",
  adminOnly,
  asyncHandler(cohortsController.createCohort)
);

// GET /quizzes/:quizId/cohorts_with_submissions
router.get(
  "/quizzes/:quizId/cohorts_with_submissions",
  adminOnly,
  asyncHandler(cohortsController.getCohortsWithSubmissions)
);

module.exports = router;
