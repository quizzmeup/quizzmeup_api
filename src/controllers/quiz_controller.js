const Quiz = require("../models/Quiz");

const QuizController = {
  postQuiz: async (req, res) => {
    try {
      const newQuiz = new Quiz({
        title: req.body.title,
      });

      await newQuiz.save();
      res.status(201).json(newQuiz);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = QuizController;
