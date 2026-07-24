const { StatusCodes } = require("http-status-codes");
const ApiResponse = require("../utils/ApiResponse");
const logger = require("../config/logger");
const env = require("../config/env");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  logger.error({
    message: err.message,
    statusCode,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  const response = new ApiResponse(
    statusCode,
    err.message || "Internal Server Error"
  );

  if (env.nodeEnv !== "production") {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = errorHandler;