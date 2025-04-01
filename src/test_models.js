require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/User");
const Cohort = require("./models/Cohort");
const Quiz = require("./models/Quiz");
const QuizVersion = require("./models/QuizVersion");
const Question = require("./models/Question");
const Submission = require("./models/Submission");
const Answer = require("./models/Answer");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🟢 Connected to MongoDB");

    // Cleanup
    await Promise.all([
      User.deleteMany(),
      Cohort.deleteMany(),
      Quiz.deleteMany(),
      QuizVersion.deleteMany(),
      Question.deleteMany(),
      Submission.deleteMany(),
      Answer.deleteMany(),
    ]);
    console.log("🧹 Collections cleaned");

    // Création de 2 cohortes dont 2 avec isCurrent (erreur attendue)
    const cohort1 = await Cohort.create({
      name: "Promo Alpha",
      isCurrent: true,
    });
    console.log("✅ Cohort1 created:", cohort1.name);

    try {
      await Cohort.create({ name: "Promo Beta", isCurrent: true });
    } catch (e) {
      console.log("🛑 Validation hook OK (only one current):", e.message);
    }

    const cohort2 = await Cohort.create({
      name: "Promo Bêta",
      isCurrent: false,
    });

    // Test statique getCurrent
    const current = await Cohort.getCurrent();
    console.log("✅ Current cohort fetched:", current.name);

    // Création user
    const user = await User.create({
      email: "test@example.com",
      salt: "abc",
      hash: "xxx",
      firstName: "Alice",
      lastName: "Dupont",
      cohorts: [cohort1._id],
    });
    console.log("✅ User created:", user.firstName);

    // Quiz + version
    const quiz = await Quiz.create({ title: "Intro JS" });
    const version = await QuizVersion.create({
      title: "Intro JS v1",
      durationInMinutes: 30,
      quiz: quiz._id,
    });
    console.log("✅ Quiz and version created:", version.title);

    // Question
    const question = await Question.create({
      title: "Quelle est la sortie de `typeof null` ?",
      markdownCode: "console.log(typeof null);",
      points: 1,
      rightAnswers: ["object"],
      propositions: ["object", "null", "undefined", "boolean"],
      multipleChoices: true,
      quizVersion: version._id,
    });
    console.log("✅ Question created:", question.title);

    // Submission minimaliste
    const submission = await Submission.create({
      user: user._id,
      cohort: cohort1._id,
      quizVersion: version._id,
      startedAt: new Date(),
    });
    console.log("✅ Submission started");

    // Réponse vide (=> score 0)
    const answer = await Answer.create({
      question: question._id,
      submission: submission._id,
      submittedAnswers: [],
      score: 0,
    });
    console.log("✅ Empty answer accepted:", answer);

    console.log("🎉 TEST COMPLETED SUCCESSFULLY");
  } catch (err) {
    console.error("💥 ERROR:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
})();
