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
    const allQuiz = await Quiz.find();

    res.status(201).json(allQuiz);
  },
};

module.exports = QuizController;
