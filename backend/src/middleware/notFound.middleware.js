const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError");

const notFound = (req, res, next) => {
  next(
    new ApiError(
      StatusCodes.NOT_FOUND,
      `Route not found: ${req.originalUrl}`
    )
  );
};

module.exports = notFound;