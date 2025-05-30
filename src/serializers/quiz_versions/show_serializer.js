class QuizVersionShowSerializer {
  constructor(quizVersion, questions = [], hasSubmissions, currentUser = null) {
    this.version = quizVersion;
    this.questions = questions;
    this.hasSubmissions = hasSubmissions;
    this.currentUser = currentUser;
  }

  serialize() {
    return {
      _id: this.version._id,
      title: this.version.title,
      durationInMinutes: this.version.durationInMinutes,
      isPublished: this.version.isPublished,
      hasSubmissions: !!this.hasSubmissions,
      quizId: this.version.quiz,
      questions: this.questions.map((q) => {
        const base = {
          _id: q._id,
          title: q.title,
          markdownCode: q.markdownCode,
          points: q.points,
          multipleChoices: q.multipleChoices,
          propositions: q.propositions,
        };

        if (this.currentUser?.isAdmin) {
          base.rightAnswers = q.rightAnswers;
        }

        return base;
      }),
    };
  }
}

module.exports = QuizVersionShowSerializer;
