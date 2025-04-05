const Quiz = require("../models/Quiz");

const QuizController = {
  postQuiz: async (req, res) => {
    const newQuiz = new Quiz({
      title: req.body.title,
    });

    await newQuiz.save();
    res.status(201).json(newQuiz);
  },

  getAllQuiz: async (req, res) => {
    let title = req.query.title;
    const filters = {};

    if (title) {
      filters.title = new RegExp(title, "i");
    }

    const allQuiz = await Quiz.find(filters);

    res.status(201).json(allQuiz);
  },

  getQuiz: async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) throw new NotFoundError("Quiz introuvable");

    const latestVersion = await quiz.latestVersion();
    const questionsCount = latestVersion
      ? await latestVersion.questionsCount()
      : 0;

    res.status(200).json({
      id: quiz._id,
      title: quiz.title,
      questionsCount,
    });
  },
};

module.exports = QuizController;
