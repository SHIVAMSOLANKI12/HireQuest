const ApiError = require("../../../utils/ApiError");
const logger = require("../../../config/logger");
const { toAssessmentResponse } = require("../assessment.mapper");
const { ASSESSMENT_MESSAGES } = require("../assessment.constants");
const { getAssessmentOrThrow } = require("../helpers/assessment-validation.helper");

/**
 * ==========================================================
 * Get Assessment By ID Service
 * ==========================================================
 */

/**
 * Core Get Assessment Logic
 */
const getAssessment = async ({ assessmentId, id }) => {
  const targetId = assessmentId || id;
  logger.info({ assessmentId: targetId }, "Fetching assessment details");

  const assessment = await getAssessmentOrThrow(targetId);

  return {
    message: ASSESSMENT_MESSAGES.ASSESSMENT_FETCHED,
    data: toAssessmentResponse(assessment),
  };
};

/**
 * Service Wrapper
 */
const getAssessmentService = async (params) => {
  try {
    const targetParams = typeof params === "string" ? { assessmentId: params } : params;
    return await getAssessment(targetParams);
  } catch (error) {
    if (error instanceof ApiError) {
      logger.warn({ error: error.message }, "Get assessment validation failed");
      throw error;
    }
    logger.error({ error: error.message, stack: error.stack }, "Unexpected error fetching assessment");
    throw new ApiError(500, "Failed to fetch assessment.");
  }
};

module.exports = getAssessmentService;
