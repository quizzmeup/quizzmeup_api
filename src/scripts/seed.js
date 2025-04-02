require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Cohort = require("../models/Cohort");
const Quiz = require("../models/Quiz");
const QuizVersion = require("../models/QuizVersion");
const Question = require("../models/Question");
const Submission = require("../models/Submission");
const Answer = require("../models/Answer");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    // Reset DB
    await Promise.all([
      User.deleteMany(),
      Cohort.deleteMany(),
      Quiz.deleteMany(),
      QuizVersion.deleteMany(),
      Question.deleteMany(),
      Submission.deleteMany(),
      Answer.deleteMany(),
    ]);

    // === Cohorts ===
    const cohort1 = await Cohort.create({
      name: "andromeda 25",
    });
    const cohort2 = await Cohort.create({
      name: "cassiopeia 24",
    });

    // === Users ===
    const users = await User.insertMany([
      {
        email: "admin@example.com",
        salt: "s1",
        hash: "h1",
        name: "Admin",
        isAdmin: true,
        cohorts: [],
      },
      {
        email: "alice@example.com",
        salt: "s2",
        hash: "h2",
        name: "Alice",
        isAdmin: false,
        cohorts: [cohort1._id],
      },
      {
        email: "bob@example.com",
        salt: "s3",
        hash: "h3",
        name: "Bob",
        isAdmin: false,
        cohorts: [cohort1._id],
      },
      {
        email: "carol@example.com",
        salt: "s4",
        hash: "h4",
        name: "Carol",
        isAdmin: false,
        cohorts: [cohort2._id],
      },
      {
        email: "david@example.com",
        salt: "s5",
        hash: "h5",
        name: "David",
        isAdmin: false,
        cohorts: [cohort2._id],
      },
    ]);

    // === Quiz 1: useEffect ===
    const quiz1 = await Quiz.create({ title: "Quiz React useEffect" });

    // Questions (base)
    const useEffectQ1 = {
      title: "Quand useEffect s’exécute-t-il ?",
      markdownCode: `useEffect(() => { console.log("Hello"); });`,
      points: 1,
      rightAnswers: ["après le rendu"],
      propositions: [],
      multipleChoices: false,
    };

    const useEffectQ2 = {
      title: "Comment éviter que useEffect s’exécute à chaque rendu ?",
      markdownCode: `useEffect(() => { doSomething(); }, [dep]);`,
      points: 1,
      rightAnswers: ["en passant un tableau de dépendances"],
      propositions: [],
      multipleChoices: false,
    };

    const useEffectQ3v1 = {
      title: "Comment nettoyer un effet ?",
      markdownCode: `useEffect(() => { const id = setInterval(...); return () => clearInterval(id); });`,
      points: 1,
      rightAnswers: ["en retournant une fonction"],
      propositions: [],
      multipleChoices: false,
    };

    const useEffectQ3v2 = {
      title: "Quel hook utiliser pour éviter un effet sur le premier render ?",
      markdownCode: `useEffect(() => { if (mounted) doSomething(); }, [mounted]);`,
      points: 1,
      rightAnswers: ["useRef"],
      propositions: [],
      multipleChoices: false,
    };

    // === Version v1
    const version1 = await QuizVersion.create({
      title: "Quiz React useEffect v1",
      durationInMinutes: 20,
      quiz: quiz1._id,
    });
    const q1v1 = await Question.create({
      ...useEffectQ1,
      quizVersion: version1._id,
    });
    const q2v1 = await Question.create({
      ...useEffectQ2,
      quizVersion: version1._id,
    });
    const q3v1 = await Question.create({
      ...useEffectQ3v1,
      quizVersion: version1._id,
    });

    // === Version v2
    const version2 = await QuizVersion.create({
      title: "Quiz React useEffect v2",
      durationInMinutes: 20,
      quiz: quiz1._id,
    });
    const q1v2 = await Question.create({
      ...useEffectQ1,
      quizVersion: version2._id,
    });
    const q2v2 = await Question.create({
      ...useEffectQ2,
      quizVersion: version2._id,
    });
    const q3v2 = await Question.create({
      ...useEffectQ3v2,
      quizVersion: version2._id,
    });

    // === Quiz 2: Context ===
    const quiz2 = await Quiz.create({ title: "Quiz React Context" });
    const versionCtx = await QuizVersion.create({
      title: "Quiz React Context v1",
      durationInMinutes: 15,
      quiz: quiz2._id,
    });

    const ctxQ1 = await Question.create({
      title: "Quel hook permet de consommer un contexte ?",
      markdownCode: `const value = useContext(MyContext);`,
      points: 1,
      rightAnswers: ["useContext"],
      propositions: ["useEffect", "useContext", "useState", "useReducer"],
      multipleChoices: true,
      quizVersion: versionCtx._id,
    });

    const ctxQ2 = await Question.create({
      title: "Quel composant permet de fournir un contexte ?",
      markdownCode: `<MyContext.Provider value={...}>`,
      points: 1,
      rightAnswers: ["Provider"],
      propositions: ["Context", "Provider", "Consumer", "Wrapper"],
      multipleChoices: true,
      quizVersion: versionCtx._id,
    });

    const ctxQ3 = await Question.create({
      title: "Peut-on imbriquer plusieurs Provider ?",
      markdownCode: `<Theme.Provider><User.Provider>...</User.Provider></Theme.Provider>`,
      points: 1,
      rightAnswers: ["oui"],
      propositions: [
        "oui",
        "non",
        "seulement en prod",
        "uniquement avec useReducer",
      ],
      multipleChoices: true,
      quizVersion: versionCtx._id,
    });

    // === Submissions

    const alice = users.find((u) => u.name === "Alice");
    const carol = users.find((u) => u.name === "Carol");

    const submission1 = await Submission.create({
      user: alice._id,
      cohort: cohort1._id,
      quizVersion: version1._id,
      startedAt: new Date(Date.now() - 5 * 60 * 1000),
      submittedAt: new Date(),
    });

    await Answer.insertMany([
      {
        question: q1v1._id,
        submission: submission1._id,
        submittedAnswers: ["après le rendu"],
        score: 1,
      },
      {
        question: q2v1._id,
        submission: submission1._id,
        submittedAnswers: ["je sais pas"],
        score: 0,
      },
      {
        question: q3v1._id,
        submission: submission1._id,
        submittedAnswers: [],
        score: 0,
      },
    ]);

    const submission2 = await Submission.create({
      user: alice._id,
      cohort: cohort1._id,
      quizVersion: versionCtx._id,
      startedAt: new Date(Date.now() - 4 * 60 * 1000),
      submittedAt: new Date(),
    });

    await Answer.insertMany([
      {
        question: ctxQ1._id,
        submission: submission2._id,
        submittedAnswers: ["useContext"],
        score: 1,
      },
      {
        question: ctxQ2._id,
        submission: submission2._id,
        submittedAnswers: ["Consumer"],
        score: 0,
      },
      {
        question: ctxQ3._id,
        submission: submission2._id,
        submittedAnswers: ["oui"],
        score: 1,
      },
    ]);

    const submission3 = await Submission.create({
      user: carol._id,
      cohort: cohort2._id,
      quizVersion: version1._id,
      startedAt: new Date(Date.now() - 10 * 60 * 1000),
      submittedAt: new Date(),
    });

    await Answer.insertMany([
      {
        question: q1v1._id,
        submission: submission3._id,
        submittedAnswers: ["pendant le rendu"],
        score: 0,
      },
      {
        question: q2v1._id,
        submission: submission3._id,
        submittedAnswers: ["en passant un tableau de dépendances"],
        score: 1,
      },
    ]);

    console.log("✅ Seed completed successfully");
  } catch (err) {
    console.error("💥 Seed error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from DB");
  }
})();
