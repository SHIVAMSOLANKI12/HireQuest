const { StatusCodes } = require("http-status-codes");
const AppError = require("./AppError");

class ConflictError extends AppError {
  constructor(
    message = "Conflict",
    errorCode = "CONFLICT",
    details = null
  ) {
    super({
      message,
      statusCode: StatusCodes.CONFLICT,
      errorCode,
      details,
    });
  }
}

module.exports = ConflictError;
