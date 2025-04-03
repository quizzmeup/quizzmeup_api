const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectToDatabase = require("../config/database");
const authRoutes = require("./routes/auth");
const QuizRoutes = require("./routes/quiz");
const QuizVersionsRoutes = require("./routes/quizVersions");
const cohortsRoutes = require("./routes/cohorts_route");
const submissionRoutes = require("./routes/submission");
const { NotFoundError } = require("./utils/errors");
const errorHandler = require("./middlewares/error-handler");
const userRoutes = require("./routes/user");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Plug shared middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Add routes
app.use("/api/auth", authRoutes);
app.use("/api", QuizRoutes);
app.use("/api", QuizVersionsRoutes);
app.use("/api/cohorts", cohortsRoutes);
app.use("/api", userRoutes);
app.use("/api", submissionRoutes);

// Root page
app.get("/", (req, res) => {
  res.send("🚀 Welcome to your Express API!");
});

// Handle unexisting routes with NotFoundError
app.all("*", (req, res, next) => {
  next(new NotFoundError("This route does not exist"));
});

// error handler middleware must be after the routes
app.use(errorHandler);

const startServer = async () => {
  await connectToDatabase();

  try {
    //app.listen(3000, () => {
    //console.log("🚀 Server started on port", 3000);
    app.listen(process.env.PORT, () => {
      console.log("🚀 Server started on port", process.env.PORT);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();
