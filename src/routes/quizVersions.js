const express = require("express");
const router = express.Router();
const QuizVersionController = require("../controllers/quizversion_controller");
const asyncHandler = require("../middlewares/async-handler");
const authMiddleware = require("../middlewares/auth_middleware");
const adminOnly = require("../middlewares/admin_only");

router.use(authMiddleware);

router.get(
  "/api/quiz_versions",
  asyncHandler(QuizVersionController.getQuizVersions)
);
router.get(
  "/api/quizzes/:quizId/quiz_versions",
  asyncHandler(QuizVersionController.getQuizVersionsByQuizId)
);
router.post(
  "/api/quizzes/:quizId/quiz_versions",
  adminOnly,
  asyncHandler(QuizVersionController.postQuizVersion)
);
router.put(
  "/api/quiz_versions/:id",
  adminOnly,
  asyncHandler(QuizVersionController.putQuizVersion)
);
router.get(
  "/api/quizzes/:quizId/most_recent_quiz_version",
  asyncHandler(QuizVersionController.getMostRecentVersionByQuizId)
);

module.exports = router;
