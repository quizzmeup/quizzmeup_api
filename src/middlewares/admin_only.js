const { ForbiddenError } = require("../utils/errors");

adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin) {
    throw new ForbiddenError("Accès réservé aux administrateurs.");
  }
  next();
};

module.exports = adminOnly;
