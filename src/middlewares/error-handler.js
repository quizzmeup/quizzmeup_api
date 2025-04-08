const { ConflictError, BadRequestError } = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  // Gestion spécifique des erreurs mongodb d'unicité de champ
  if (err.code === 11000) {
    console.log(err.code);
    const duplicatedField = Object.keys(err.keyValue || {})[0];
    const message = `Le champ "${duplicatedField}" est déjà utilisé.`;
    err = new ConflictError(message);
  }

  // Gestion des erreurs MongoDB
  if (err.name === "MongoServerError") {
    err = new BadRequestError(err.message);
  }

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
};

module.exports = errorHandler;
