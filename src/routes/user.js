const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/user_controller");
const asyncHandler = require("../middlewares/async-handler");
const authMiddleware = require("../middlewares/auth_middleware");
const adminOnly = require("../middlewares/admin_only");

router.use(authMiddleware);

// GET api/users
router.get("/users", adminOnly, asyncHandler(UsersController.getUsers));

// GET api/quizzes/:quizId/cohorts/:cohortId/users_with_submissions
router.get(
  "/quizzes/:quizId/cohorts/:cohortId/users_with_submissions",
  adminOnly,
  asyncHandler(UsersController.getUsersWithSubmissionsForCohort)
);

module.exports = router;
