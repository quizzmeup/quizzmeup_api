const express = require("express");
const router = express.Router();
const QuizVersionController = require("../controllers/QuizVersion_controller");
const asyncHandler = require("../middlewares/async-handler");

router.get(
  "/api/quiz_versions",
  asyncHandler(QuizVersionController.getQuizVersions)
);
router.get(
  "/api/quiz_versions/:id",
  asyncHandler(QuizVersionController.getQuizVersionsId)
);
router.post(
  "/api/quiz_versions",
  asyncHandler(QuizVersionController.postQuizVersions)
);
router.put(
  "/api/quiz_versions/:id",
  asyncHandler(QuizVersionController.putQuizVersionsId)
);

module.exports = router;
