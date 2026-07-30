const { StatusCodes } = require("http-status-codes");
const AppError = require("./AppError");

class BadRequestError extends AppError {
  constructor(
    message = "Bad Request",
    errorCode = "BAD_REQUEST",
    details = null
  ) {
    super({
      message,
      statusCode: StatusCodes.BAD_REQUEST,
      errorCode,
      details,
    });
  }
}

module.exports = BadRequestError;
