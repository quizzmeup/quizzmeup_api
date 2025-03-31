const mongoose = require("mongoose");

const CohortSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    isCurrent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Méthode statique pour récupérer la current cohort
CohortSchema.statics.getCurrent = async function () {
  return this.findOne({ isCurrent: true });
};

// Hook pour garantir unicité de isCurrent = true
CohortSchema.pre("save", async function (next) {
  if (!this.isCurrent) return next();

  const existing = await mongoose.models.Cohort.findOne({
    isCurrent: true,
    _id: { $ne: this._id },
  });

  if (existing) {
    const err = new Error(
      `Il existe déjà une cohorte courante (${existing.name}). Une seule cohorte peut être isCurrent à la fois.`
    );
    err.name = "ValidationError";
    return next(err);
  }

  next();
});

module.exports = mongoose.model("Cohort", CohortSchema);
