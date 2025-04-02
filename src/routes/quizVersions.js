const express = require("express");
const router = express.Router();
const QuizVersionController = require("../controllers/quizversion_controller");
const asyncHandler = require("../middlewares/async-handler");

router.get(
  "/api/quiz_versions",
  asyncHandler(QuizVersionController.getQuizVersions)
);
router.get(
  "/api/quiz_versions/:id",
  asyncHandler(QuizVersionController.getQuizVersionsById)
);
router.post(
  "/api/quiz_versions",
  asyncHandler(QuizVersionController.postQuizVersion)
);
router.put(
  "/api/quiz_versions/:id",
  asyncHandler(QuizVersionController.putQuizVersion)
);

module.exports = router;
