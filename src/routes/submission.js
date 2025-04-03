const express = require("express");
const router = express.Router();
const asyncHandler = require("../middlewares/async-handler");
const submissionController = require("../controllers/submission_controller");
const authMiddleware = require("../middlewares/auth_middleware");
const adminOnly = require("../middlewares/admin_only");

router.use(authMiddleware); // ici : tout ce qui suit est protégé

// GET /api/users/:user_id/submissions
router.get(
  "/users/:user_id/submissions",
  asyncHandler(submissionController.indexByUser)
);

// GET /api/quizzes/:quiz_id/submissions
router.get(
  "/quizzes/:quiz_id/submissions",
  adminOnly,
  asyncHandler(submissionController.indexByQuiz)
);

// GET /api/submissions/:id
router.get("/submissions/:id", asyncHandler(submissionController.show));

// POST /api/quizzes/:quiz_version_id/submissions
router.post(
  "/quiz_versions/:quiz_version_id/submissions",
  asyncHandler(submissionController.create)
);

module.exports = router;
