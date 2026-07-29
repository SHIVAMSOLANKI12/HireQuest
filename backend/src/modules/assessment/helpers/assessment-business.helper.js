const ApiError = require("../../../utils/ApiError");
const {
  ASSESSMENT_STATUS,
  ASSESSMENT_ERRORS,
} = require("../assessment.constants");
const { AUTH_ROLES } = require("../../auth/auth.constants");

/**
 * ==========================================================
 * Assessment Business Helper
 * ==========================================================
 * Business rules, status locks, scoring & ownership validation.
 * ==========================================================
 */

/**
 * Validate scoring rules and duration ranges
 */
const validateAssessmentRules = (payload) => {
  if (payload.maximumScore !== undefined && payload.maximumScore <= 0) {
    throw new ApiError(400, "Maximum score must be greater than zero.");
  }

  if (
    payload.passingScore !== undefined &&
    payload.maximumScore !== undefined &&
    payload.passingScore > payload.maximumScore
  ) {
    throw new ApiError(400, ASSESSMENT_ERRORS.PASSING_SCORE_INVALID);
  }

  if (payload.maxAttempts !== undefined && payload.maxAttempts < 1) {
    throw new ApiError(400, ASSESSMENT_ERRORS.MAX_ATTEMPTS_INVALID);
  }

  if (payload.durationMinutes !== undefined && payload.durationMinutes <= 0) {
    throw new ApiError(400, "Assessment duration must be greater than zero.");
  }
};

/**
 * Validate editable status lock
 */
const validateEditableStatus = (assessment) => {
  if (assessment.status === ASSESSMENT_STATUS.PUBLISHED) {
    throw new ApiError(400, ASSESSMENT_ERRORS.CANNOT_EDIT_PUBLISHED);
  }

  if (assessment.status === ASSESSMENT_STATUS.ARCHIVED) {
    throw new ApiError(400, ASSESSMENT_ERRORS.ALREADY_ARCHIVED);
  }
};

/**
 * Validate deletion status lock
 */
const validateDeleteStatus = (assessment) => {
  switch (assessment.status) {
    case ASSESSMENT_STATUS.DRAFT:
      return;
    case ASSESSMENT_STATUS.PUBLISHED:
      throw new ApiError(400, "Published assessments cannot be deleted. Archive them instead.");
    case ASSESSMENT_STATUS.ACTIVE:
      throw new ApiError(400, "Active assessments cannot be deleted. Archive them first.");
    case ASSESSMENT_STATUS.ARCHIVED:
      throw new ApiError(400, "Archived assessments cannot be deleted.");
    default:
      throw new ApiError(400, ASSESSMENT_ERRORS.INVALID_STATUS);
  }
};

/**
 * Validate Ownership / Access Permission
 * HR can only manage assessments created by themselves; SUPER_ADMIN can manage all.
 */
const validateOwnership = (assessment, user) => {
  if (!user) return;
  if (user.role === AUTH_ROLES.SUPER_ADMIN) return;

  if (assessment.createdById && assessment.createdById !== user.id) {
    throw new ApiError(403, "Forbidden: You do not have permission to access or modify this assessment.");
  }
};

module.exports = {
  validateAssessmentRules,
  validateEditableStatus,
  validateDeleteStatus,
  validateOwnership,
};
