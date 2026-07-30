const { StatusCodes } = require("http-status-codes");
const AppError = require("../exceptions/AppError");
const logger = require("../../config/logger");

/**
 * ==========================================================
 * Enterprise Global Error Handler Middleware
 * ==========================================================
 * Catches all operational errors (AppError, Zod, Prisma, JWT)
 * and formats them into a standardized error response contract:
 * {
 *   "success": false,
 *   "error": {
 *     "code": "ERR_CODE",
 *     "message": "Error description",
 *     "details": []
 *   }
 * }
 * ==========================================================
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let errorCode = err.errorCode || "INTERNAL_SERVER_ERROR";
  let message = err.message || "An unexpected error occurred.";
  let details = err.details || null;

  // 1. AppError (Operational Custom Exceptions)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorCode = err.errorCode;
    message = err.message;
    details = err.details;
  }
  // 2. Prisma Known Request Error (e.g. P2002 Unique Constraint, P2025 Record Not Found)
  else if (err.code && typeof err.code === "string" && err.code.startsWith("P")) {
    if (err.code === "P2002") {
      statusCode = StatusCodes.CONFLICT;
      errorCode = "DUPLICATE_ENTRY";
      message = "A record with this field value already exists.";
      details = err.meta ? { target: err.meta.target } : null;
    } else if (err.code === "P2025") {
      statusCode = StatusCodes.NOT_FOUND;
      errorCode = "RESOURCE_NOT_FOUND";
      message = "The requested record was not found.";
    } else if (err.code === "P2003") {
      statusCode = StatusCodes.BAD_REQUEST;
      errorCode = "FOREIGN_KEY_CONSTRAINT";
      message = "Invalid reference ID provided for related record.";
    } else {
      statusCode = StatusCodes.BAD_REQUEST;
      errorCode = `PRISMA_ERROR_${err.code}`;
    }
  }
  // 3. Zod Schema Validation Error
  else if (err.name === "ZodError" || (err.issues && Array.isArray(err.issues))) {
    statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
    errorCode = "VALIDATION_ERROR";
    message = "Request validation failed.";
    const issues = err.issues || err.errors || [];
    details = issues.map((issue) => ({
      field: issue.path.length > 0 ? issue.path.join(".") : "body",
      message: issue.message,
    }));
  }
  // 4. JWT Authentication Errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = StatusCodes.UNAUTHORIZED;
    errorCode = "INVALID_TOKEN";
    message = "Invalid authentication token.";
  } else if (err.name === "TokenExpiredError") {
    statusCode = StatusCodes.UNAUTHORIZED;
    errorCode = "TOKEN_EXPIRED";
    message = "Authentication token has expired. Please login again.";
  }

  // Log Error Payload
  logger.error({
    message: err.message,
    statusCode,
    errorCode,
    path: req.originalUrl,
    method: req.method,
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });

  return res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      details,
    },
  });
};

module.exports = errorHandler;
