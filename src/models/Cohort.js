const mongoose = require("mongoose");

const CohortSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cohort", CohortSchema);
