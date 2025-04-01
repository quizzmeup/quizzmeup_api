const express = require("express");
const router = express.Router();
const QuizController = require("../controllers/quiz_controller");
const asyncHandler = require("../middlewares/async-handler");

router.post("/api/quizzes", asyncHandler(QuizController.postQuiz));

module.exports = router;
