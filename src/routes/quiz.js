const express = require("express");
const router = express.Router();
const QuizController = require("../controllers/quiz_controller");
const asyncHandler = require("../middlewares/async-handler");
const authMiddleware = require("../middlewares/auth_middleware");
const adminOnly = require("../middlewares/admin_only");

router.use(authMiddleware);

router.post("/quizzes", adminOnly, asyncHandler(QuizController.postQuiz));

router.get("/quizzes", asyncHandler(QuizController.getAllQuiz));

module.exports = router;
