const ApiError = require("../../../utils/ApiError");

/**
 * ==========================================================
 * Assessment Date Helper
 * ==========================================================
 * Validates scheduling timestamps sequence for Assessment module.
 * ==========================================================
 */

/**
 * Validate assessment schedule date sequence
 */
const validateAssessmentDates = ({ publishAt, startsAt, endsAt }) => {
  if (publishAt && startsAt && new Date(startsAt) < new Date(publishAt)) {
    throw new ApiError(400, "Assessment start date cannot be before publish date.");
  }

  if (startsAt && endsAt && new Date(endsAt) <= new Date(startsAt)) {
    throw new ApiError(400, "Assessment end date must be after start date.");
  }
};

module.exports = {
  validateAssessmentDates,
};
