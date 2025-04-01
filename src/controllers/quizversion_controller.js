const QuizVersion = require("../models/QuizVersion");

const QuizVersionController = {
  // GET - Récupérer toutes les versions de quiz
  getQuizVersions: async (req, res) => {
    try {
      const quizVersions = await QuizVersion.find();
      return res.status(200).json({ message: quizVersions });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // GET - Récupérer toutes les versions d'un quiz spécifique via son ID
  // param : ID du quiz
  getQuizVersionsId: async (req, res) => {
    try {
      const quizVersions = await QuizVersion.find({
        quiz: req.params.id,
      }).populate("quiz");

      return res.status(200).json({ message: quizVersions });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // POST - Créer une nouvelle version de quiz
  postQuizVersions: async (req, res) => {
    try {
      const newQuizVersions = new QuizVersion({
        title: req.body.title,
        durationInMinutes: req.body.durationInMinutes,
        quiz: req.body.quiz,
      });

      await newQuizVersions.save();
      res.status(201).json(newQuizVersions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // PUT - Mettre à jour une QuizVersion via son ID
  // param : ID de la QuizVersion à mettre à jour
  putQuizVersionsId: async (req, res) => {
    try {
      const quizVersionId = req.params.id;
      const updateData = req.body;

      const updatedQuizVersion = await QuizVersion.findByIdAndUpdate(
        quizVersionId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedQuizVersion) {
        return res.status(404).json({ message: "QuizVersion non trouvée" });
      }

      return res.status(200).json(updatedQuizVersion);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = QuizVersionController;
