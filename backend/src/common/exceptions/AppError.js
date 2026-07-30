/**
 * ==========================================================
 * Base App Error Class
 * ==========================================================
 * Standardized base exception class for all operational errors across modules.
 * ==========================================================
 */
class AppError extends Error {
  constructor({
    message,
    statusCode = 500,
    errorCode = "INTERNAL_SERVER_ERROR",
    details = null,
    isOperational = true,
  }) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
