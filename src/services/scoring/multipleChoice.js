class MultipleChoiceScoringService {
  constructor(question, submittedAnswers) {
    this.question = question;
    this.submittedAnswers = submittedAnswers || [];
  }

  computeScore() {
    const { question, submittedAnswers } = this;
    const correct = question.rightAnswers;

    const isExactMatch =
      submittedAnswers.length === correct.length &&
      submittedAnswers.every((ans) => correct.includes(ans));

    return isExactMatch ? question.points : 0;
  }
}

module.exports = MultipleChoiceScoringService;
