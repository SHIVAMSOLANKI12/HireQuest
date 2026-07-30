const { StatusCodes } = require("http-status-codes");
const AppError = require("./AppError");

class ForbiddenError extends AppError {
  constructor(
    message = "Forbidden",
    errorCode = "FORBIDDEN",
    details = null
  ) {
    super({
      message,
      statusCode: StatusCodes.FORBIDDEN,
      errorCode,
      details,
    });
  }
}

module.exports = ForbiddenError;
