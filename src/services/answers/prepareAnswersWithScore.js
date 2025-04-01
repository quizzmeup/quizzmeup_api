const Question = require("../../models/Question");
const FreeAnswerScoringService = require("../scoring/freeAnswer");
const MultipleChoiceScoringService = require("../scoring/multipleChoice");

module.exports = async function prepareAnswersWithScore(
  submission,
  answersPayload
) {
  const questions = await Question.find({
    quizVersion: submission.quizVersion,
  });

  const answers = [];

  for (const payload of answersPayload) {
    const question = questions.find(
      (q) => q._id.toString() === payload.question
    );
    if (!question) continue;

    const submitted = payload.submittedAnswers || [];

    let score = 0;
    if (question.multipleChoices) {
      const service = new MultipleChoiceScoringService(question, submitted);
      score = service.computeScore();
    } else {
      const service = new FreeAnswerScoringService(question, submitted);
      score = service.computeScore();
    }

    answers.push({
      question: question._id,
      submission: submission._id,
      submittedAnswers: submitted,
      score,
    });
  }

  return answers;
};
