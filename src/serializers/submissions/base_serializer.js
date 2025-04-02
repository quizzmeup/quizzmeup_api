class BaseSubmissionSerializer {
  constructor(submission) {
    this.submission = submission;
  }

  serialize() {
    return {
      _id: this.submission._id,
      quizVersion: {
        _id: this.submission.quizVersion._id,
        title: this.submission.quizVersion.title,
      },
      user: {
        _id: this.submission.user._id,
        name: this.submission.user.name,
      },
      cohort: {
        _id: this.submission.cohort._id,
        name: this.submission.cohort.name,
      },
      submittedAt: this.submission.submittedAt,
      score: this.submission.score,
    };
  }
}

module.exports = BaseSubmissionSerializer;
