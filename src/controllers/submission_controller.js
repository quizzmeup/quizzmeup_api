const {
  fetchUserSubmissions,
  fetchQuizSubmissions,
  fetchSubmissionWithAnswers,
  createSubmissionWithAnswers,
} = require("../services/submissions");

const SubmissionShowSerializer = require("../serializers/submissions/show_serializer");
const SubmissionBaseSerializer = require("../serializers/submissions/base_serializer");

module.exports = {
  indexByUser: async (req, res) => {
    const submissions = await fetchUserSubmissions(req.params.user_id);
    const serialized = submissions.map((s) =>
      new SubmissionBaseSerializer(s).serialize()
    );
    res.json(serialized);
  },

  indexByQuiz: async (req, res) => {
    const submissions = await fetchQuizSubmissions(req.params.quiz_id);
    const serialized = submissions.map((s) =>
      new SubmissionBaseSerializer(s).serialize()
    );
    res.json(serialized);
  },

  show: async (req, res) => {
    const submission = await fetchSubmissionWithAnswers(req.params.id);
    const serialized = new SubmissionShowSerializer(submission).serialize();
    res.json(serialized);
  },

  create: async (req, res) => {
    const submission = await createSubmissionWithAnswers({
      user: req.user._id,
      quizVersionId: req.params.quiz_version_id,
      cohortId: req.body.cohort,
      answersPayload: req.body.answers,
    });

    const serialized = new SubmissionShowSerializer(submission).serialize();
    res.status(201).json(serialized);
  },
};
