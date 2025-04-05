const QuizVersion = require("../models/QuizVersion");
const Submission = require("../models/Submission");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const { NotFoundError, BadRequestError } = require("../utils/errors");
const { UnauthorizedError } = require("../utils/errors");
const QuizVersionShowSerializer = require("../serializers/quiz_versions/show_serializer");

const QuizVersionController = {
  // GET - Récupérer toutes les versions de quiz
  // Cette route semble inutile
  getQuizVersions: async (req, res) => {
    const quizVersions = await QuizVersion.find();
    return res.status(200).json({ message: quizVersions });
  },

  // GET - Récupérer toutes les versions d'un quiz spécifique via son ID
  // param : ID du quiz
  // Cette route semble inutile
  getQuizVersionsByQuizId: async (req, res) => {
    const quizVersions = await QuizVersion.find({
      quiz: req.params.quizId,
    }).populate("quiz");

    return res.status(200).json({ quizVersions });
  },

  getMostRecentVersionByQuizId: async (req, res) => {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) throw new NotFoundError("Quiz introuvable");

    const includeUnpublished = req.query.includeUnpublished === "true";
    const isOwner = quiz.creator?.toString() === req.user._id.toString();

    // if (includeUnpublished && !isOwner) {
    //   throw new UnauthorizedError(
    //     "Seul le créateur du quiz peut accéder aux versions non publiées"
    //   );
    // }

    const version = includeUnpublished
      ? await quiz.latestVersion()
      : await quiz.latestPublishedVersion();

    if (!version) {
      throw new NotFoundError("Aucune version trouvée pour ce quiz");
    }

    const questions = await Question.find({ quizVersion: version._id });

    const serialized = new QuizVersionShowSerializer(
      version,
      questions,
      req.user
    ).serialize();

    res.status(200).json(serialized);
  },

  // POST - Créer une nouvelle version de quiz
  postQuizVersion: async (req, res) => {
    const { title, durationInMinutes, questions = [] } = req.body;
    const quizId = req.params.quizId;

    const newQuizVersion = new QuizVersion({
      title,
      durationInMinutes,
      quiz: quizId,
    });

    await newQuizVersion.save();

    let createdQuestions = [];

    if (questions.length > 0) {
      const questionDocs = questions.map((q) => ({
        ...q,
        quizVersion: newQuizVersion._id,
      }));

      createdQuestions = await Question.insertMany(questionDocs);
    }

    const serialized = new QuizVersionShowSerializer(
      newQuizVersion,
      createdQuestions,
      req.user
    ).serialize();

    res.status(201).json(serialized);
  },

  // PUT - Mettre à jour une QuizVersion via son ID seulement si il n'y a pas de soumissions correspondantes
  // param : ID de la QuizVersion à mettre à jour
  putQuizVersion: async (req, res) => {
    const quizVersionId = req.params.id;
    const { title, durationInMinutes, questions = [] } = req.body;

    const exists = await Submission.exists({ quizVersion: quizVersionId });
    if (exists) {
      throw new UnauthorizedError(
        "Des réponses ont été soumises, impossible de modifier ce quiz"
      );
    }

    const updatedVersion = await QuizVersion.findByIdAndUpdate(
      quizVersionId,
      { title, durationInMinutes },
      { new: true, runValidators: true }
    );

    if (!updatedVersion) {
      throw new NotFoundError("QuizVersion non trouvée");
    }

    // Suppression des anciennes questions
    await Question.deleteMany({ quizVersion: updatedVersion._id });

    // Création des nouvelles questions
    let createdQuestions = [];
    if (questions.length > 0) {
      const questionDocs = questions.map((q) => ({
        ...q,
        quizVersion: updatedVersion._id,
      }));
      createdQuestions = await Question.insertMany(questionDocs);
    }

    const serialized = new QuizVersionShowSerializer(
      updatedVersion,
      createdQuestions,
      req.user
    ).serialize();

    res.status(200).json(serialized);
  },

  publish: async (req, res) => {
    const { id } = req.params;

    const quizVersion = await QuizVersion.findById(id);
    if (!quizVersion) throw new NotFoundError("QuizVersion non trouvée");

    const questionCount = await Question.countDocuments({ quizVersion: id });
    if (questionCount === 0) {
      throw new BadRequestError(
        "Impossible de publier un quiz sans questions."
      );
    }

    quizVersion.isPublished = true;
    await quizVersion.save();

    res.status(200).json({ message: "Quiz publié avec succès" });
  },
};

module.exports = QuizVersionController;
