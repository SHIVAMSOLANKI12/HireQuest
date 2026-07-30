const { StatusCodes } = require("http-status-codes");
const AppError = require("./AppError");

class NotFoundError extends AppError {
  constructor(
    message = "Resource not found",
    errorCode = "NOT_FOUND",
    details = null
  ) {
    super({
      message,
      statusCode: StatusCodes.NOT_FOUND,
      errorCode,
      details,
    });
  }
}

module.exports = NotFoundError;
