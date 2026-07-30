const { StatusCodes } = require("http-status-codes");
const AppError = require("./AppError");

class ValidationError extends AppError {
  constructor(
    message = "Validation failed",
    details = [],
    errorCode = "VALIDATION_ERROR"
  ) {
    super({
      message,
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      errorCode,
      details,
    });
  }
}

module.exports = ValidationError;
