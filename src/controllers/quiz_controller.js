const Quiz = require("../models/Quiz");
const findSubmissionsByQuizIdForUser = require("../services/quizzes/find_submissions_by_quiz_id");
const { UnauthorizedError, NotFoundError } = require("../utils/errors");

const QuizController = {
  postQuiz: async (req, res) => {
    const newQuiz = new Quiz({
      title: req.body.title,
    });

    await newQuiz.save();
    res.status(201).json(newQuiz);
  },

  getAllQuiz: async (req, res) => {
    const includeUnpublished = req.query.includeUnpublished === "true";

    if (includeUnpublished) {
      if (!req.user.isAdmin) {
        throw new UnauthorizedError(
          "Seuls les admins peuvent accéder à tous les quiz, y compris les non publiés"
        );
      }

      const allQuizzes = await Quiz.find();
      return res.json(allQuizzes);
    }

    const quizzes = await Quiz.withPublishedVersions();
    const submissionMap = await findSubmissionsByQuizIdForUser(
      quizzes,
      req.user._id
    );

    const data = quizzes.map((quiz) => ({
      id: quiz._id,
      title: quiz.title,
      submissionId: submissionMap.get(quiz._id.toString()) || null,
    }));

    res.json(data);
  },

  getQuiz: async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) throw new NotFoundError("Quiz introuvable");

    const latestPublishedVersion = await quiz.latestPublishedVersion();
    const questionsCount = latestPublishedVersion
      ? await latestPublishedVersion.questionsCount()
      : 0;

    res.status(200).json({
      id: quiz._id,
      title: quiz.title,
      questionsCount,
    });
  },
};

module.exports = QuizController;
