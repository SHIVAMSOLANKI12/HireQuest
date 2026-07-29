const ApiError = require("../../../utils/ApiError");
const assessmentRepository = require("../repositories/assessment.repository");
const { ASSESSMENT_ERRORS } = require("../assessment.constants");

/**
 * ==========================================================
 * Assessment Validation Helper
 * ==========================================================
 * Centralized existence & title uniqueness validation helpers.
 * ==========================================================
 */

/**
 * Fetch Assessment or Throw 404
 */
const getAssessmentOrThrow = async (assessmentId, tx) => {
  const assessment = await assessmentRepository.findAssessmentById(tx, assessmentId);

  if (!assessment) {
    throw new ApiError(404, ASSESSMENT_ERRORS.NOT_FOUND);
  }

  return assessment;
};

/**
 * Duplicate title validation for new assessments
 */
const validateDuplicateTitle = async (title, tx) => {
  if (!title) return;
  const existingAssessment = await assessmentRepository.findAssessmentByTitle(tx, title.trim());

  if (existingAssessment) {
    throw new ApiError(409, ASSESSMENT_ERRORS.DUPLICATE_TITLE);
  }
};

/**
 * Duplicate title validation excluding current assessment ID
 */
const validateDuplicateTitleExcludingCurrent = async (assessmentId, title, tx) => {
  if (!title) return;
  const existingAssessment = await assessmentRepository.findAssessmentByTitleExcludingId(
    tx,
    title.trim(),
    assessmentId
  );

  if (existingAssessment) {
    throw new ApiError(409, ASSESSMENT_ERRORS.DUPLICATE_TITLE);
  }
};

module.exports = {
  getAssessmentOrThrow,
  validateExistingAssessment: getAssessmentOrThrow,
  validateDuplicateTitle,
  validateDuplicateTitleExcludingCurrent,
};
