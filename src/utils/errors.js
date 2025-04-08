const pluralize = require("pluralize");

class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message, options = {}) {
    const modelName = options.modelName || "Resource";
    super(message || `${modelName} not found`, 404);
  }
}

class BadRequestError extends AppError {
  constructor(message, options = {}) {
    if (options.err?.name === "CastError") {
      message = `Invalid ID format for field "${options.err.path}"`;
    }

    if (options.err?.name === "ValidationError") {
      const errorMessages = Object.values(options.err.errors).map(
        (e) => e.message
      );
      message = `Validation failed: ${errorMessages.join(", ")}`;
    }

    super(message || "Bad Request", 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

class DuplicateKeyError extends AppError {
  constructor(message, options = {}) {
    const modelName = extractModelName(options.err);
    const fieldName = Object.keys(options.err.keyPattern)[0]; // Ex: "email"
    super(message || `${modelName} with this ${fieldName} already exists`, 400);
  }
}

class ConflictError extends AppError {
  constructor(message = "Conflict Error") {
    super(message, 400);
  }
}

const extractModelName = (err) => {
  const match = err.message.match(/collection: (\w+)\.(\w+)/);
  if (match && match[2]) {
    let modelName = pluralize.singular(match[2]);
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  }
  return "UnknownModel";
};

module.exports = {
  AppError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  DuplicateKeyError,
  ForbiddenError,
  ConflictError,
};
