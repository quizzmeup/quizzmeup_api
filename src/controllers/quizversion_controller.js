const QuizVersion = require("../models/QuizVersion");
const Submission = require("../models/Submission");

const QuizVersionController = {
  // GET - Récupérer toutes les versions de quiz
  getQuizVersions: async (req, res) => {
    const quizVersions = await QuizVersion.find();
    return res.status(200).json({ message: quizVersions });
  },

  // GET - Récupérer toutes les versions d'un quiz spécifique via son ID
  // param : ID du quiz
  getQuizVersionsById: async (req, res) => {
    const quizVersions = await QuizVersion.find({
      quiz: req.params.id,
    }).populate("quiz");

    return res.status(200).json({ message: quizVersions });
  },

  // POST - Créer une nouvelle version de quiz
  postQuizVersion: async (req, res) => {
    const newQuizVersions = new QuizVersion({
      title: req.body.title,
      durationInMinutes: req.body.durationInMinutes,
      quiz: req.body.quiz,
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

    // on verifie qu'aucune réponse a ce quizversion n'a encore été soumise avant l'update

    console.log("quizVersionId  =" + quizVersionId); // OK

    const submissionExisting = await Submission.find({
      quizVersion: quizVersionId,
    });

    if (submissionExisting.length > 0) {
      return res.status(403).json({
        message:
          "Des réponses ont été soumises, impossible de modifier ce quiz",
      });
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
