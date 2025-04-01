const levenshtein = require("fast-levenshtein");
MAX_LEVENSHTEIN_DISTANCE = 2;

class FreeAnswerScoringService {
  constructor(question, submittedAnswers) {
    this.question = question;
    this.submittedAnswers = submittedAnswers || [];
  }

  computeScore() {
    const userAnswer = (this.submittedAnswers[0] || "").trim().toLowerCase();
    const accepted = this.question.rightAnswers.map((r) =>
      r.trim().toLowerCase()
    );

    const isCloseEnough = accepted.some(
      (r) => levenshtein.get(r, userAnswer) <= MAX_LEVENSHTEIN_DISTANCE
    );

    return isCloseEnough ? this.question.points : 0;
  }
}

module.exports = FreeAnswerScoringService;
