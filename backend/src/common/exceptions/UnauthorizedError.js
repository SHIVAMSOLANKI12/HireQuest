const { StatusCodes } = require("http-status-codes");
const AppError = require("./AppError");

class UnauthorizedError extends AppError {
  constructor(
    message = "Unauthorized",
    errorCode = "UNAUTHORIZED",
    details = null
  ) {
    super({
      message,
      statusCode: StatusCodes.UNAUTHORIZED,
      errorCode,
      details,
    });
  }
}

module.exports = UnauthorizedError;
