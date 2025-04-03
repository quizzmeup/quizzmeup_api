const QuizVersion = require("../models/QuizVersion");
const Submission = require("../models/Submission");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const { NotFoundError } = require("../utils/errors");
const { UnauthorizedError } = require("../utils/errors");

const QuizVersionController = {
  // GET - Récupérer toutes les versions de quiz
  getQuizVersions: async (req, res) => {
    const quizVersions = await QuizVersion.find();
    return res.status(200).json({ message: quizVersions });
  },

  // GET - Récupérer toutes les versions d'un quiz spécifique via son ID
  // param : ID du quiz
  getQuizVersionsByQuizId: async (req, res) => {
    const quizVersions = await QuizVersion.find({
      quiz: req.params.quizId,
    }).populate("quiz");

    return res.status(200).json({ quizVersions });
  },

  getMostRecentVersionByQuizId: async (req, res, next) => {
    try {
      const quiz = await Quiz.findById(req.params.quizId);
      if (!quiz) throw new NotFoundError("Quiz introuvable");

      const version = await QuizVersion.findOne({ quiz: quiz._id }).sort({
        createdAt: -1,
      });

      if (!version)
        throw new NotFoundError("Aucune version trouvée pour ce quiz");

      const questions = await Question.find({
        quizVersion: version._id,
      }).select("_id title markdownCode points multipleChoices propositions");

      res.status(200).json({
        _id: version._id,
        title: version.title,
        durationInMinutes: version.durationInMinutes,
        questions: questions.map((q) => ({
          _id: q._id,
          title: q.title,
          markdownCode: q.markdownCode,
          points: q.points,
          multipleChoices: q.multipleChoices,
          propositions: q.propositions,
          rightAnswers: q.rightAnswers,
        })),
      });
    } catch (err) {
      next(err);
    }
  },

  // POST - Créer une nouvelle version de quiz
  postQuizVersion: async (req, res) => {
    const newQuizVersions = new QuizVersion({
      title: req.body.title,
      durationInMinutes: req.body.durationInMinutes,
      quiz: req.params.quizId,
    });

    await newQuizVersions.save();
    res.status(201).json(newQuizVersions);
  },

  // PUT - Mettre à jour une QuizVersion via son ID seulement si il n'y a pas de soumissions correspondantes
  // param : ID de la QuizVersion à mettre à jour
  putQuizVersion: async (req, res) => {
    const quizVersionId = req.params.id;
    const title = req.body.title;
    const durationInMinutes = req.body.durationInMinutes;

    const exists = await Submission.exists({ quizVersion: quizVersionId });
    if (exists) {
      throw new UnauthorizedError(
        "Des réponses ont été soumises, impossible de modifier ce quiz"
      );
    }

    const updatedQuizVersion = await QuizVersion.findByIdAndUpdate(
      quizVersionId,
      { title, durationInMinutes },
      { new: true, runValidators: true }
    );

    if (!updatedQuizVersion) {
      return res.status(404).json({ message: "QuizVersion non trouvée" });
    }

    return res.status(200).json(updatedQuizVersion);
  },
};

module.exports = QuizVersionController;
