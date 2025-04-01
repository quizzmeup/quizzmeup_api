const BaseSubmissionSerializer = require("./base_serializer");

class ShowSubmissionSerializer extends BaseSubmissionSerializer {
  serialize() {
    const base = super.serialize();

    const answers = this.submission.answers.map((answer) => ({
      question: {
        _id: answer.question._id,
        title: answer.question.title,
        points: answer.question.points,
        rightAnswers: answer.question.rightAnswers,
        propositions: answer.question.propositions,
      },
      submittedAnswers: answer.submittedAnswers,
      score: answer.score,
    }));

    return {
      ...base,
      answers,
      score: answers.reduce((sum, a) => sum + a.score, 0),
    };
  }
}

module.exports = ShowSubmissionSerializer;
