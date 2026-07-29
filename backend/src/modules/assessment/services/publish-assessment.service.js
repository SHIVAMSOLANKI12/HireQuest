const { runTransaction } = require("../../../config/prisma");
const ApiError = require("../../../utils/ApiError");
const logger = require("../../../config/logger");

const assessmentRepository = require("../repositories/assessment.repository");
const auditLogRepository = require("../../auth/repositories/audit-log.repository");

const { toAssessmentResponse } = require("../assessment.mapper");
const {
  ASSESSMENT_MESSAGES,
  AUDIT_ACTIONS,
  AUDIT_MODULES,
  ASSESSMENT_STATUS,
  ASSESSMENT_ERRORS,
} = require("../assessment.constants");
const { getAssessmentOrThrow } = require("../helpers/assessment-validation.helper");
const { validateOwnership } = require("../helpers/assessment-business.helper");

/**
 * Validate Status Rules for Publishing
 */
const validatePublishStatus = (assessment) => {
  if (assessment.status === ASSESSMENT_STATUS.PUBLISHED) {
    throw new ApiError(400, ASSESSMENT_ERRORS.ALREADY_PUBLISHED);
  }

  if (assessment.status === ASSESSMENT_STATUS.ARCHIVED) {
    throw new ApiError(400, ASSESSMENT_ERRORS.ALREADY_ARCHIVED);
  }
};

/**
 * Validate Assessment Content Rules Before Publishing
 */
const validateAssessmentContent = (assessment) => {
  if (assessment.durationMinutes <= 0) {
    throw new ApiError(400, "Assessment duration is invalid.");
  }

  if (assessment.passingScore > assessment.maximumScore) {
    throw new ApiError(400, ASSESSMENT_ERRORS.PASSING_SCORE_INVALID);
  }
};

/**
 * Main Publish Assessment Logic
 */
const publishAssessment = async ({ assessmentId, id, user }) => {
  const targetId = assessmentId || id;
  logger.info({ assessmentId: targetId, userId: user?.id }, "Publishing assessment");

  return runTransaction(async (tx) => {
    const assessment = await getAssessmentOrThrow(targetId, tx);

    validateOwnership(assessment, user);
    validatePublishStatus(assessment);
    validateAssessmentContent(assessment);

    const publishedAssessment = await assessmentRepository.publishAssessment(tx, targetId, new Date());

    if (user?.id && auditLogRepository && typeof auditLogRepository.createAuditLog === "function") {
      await auditLogRepository.createAuditLog(tx, {
        userId: user.id,
        action: AUDIT_ACTIONS.PUBLISH,
        module: AUDIT_MODULES.ASSESSMENT,
        description: `Assessment "${publishedAssessment.title}" published.`,
      });
    }

    logger.info({ assessmentId: targetId, userId: user?.id }, "Assessment published successfully");

    return {
      message: ASSESSMENT_MESSAGES.PUBLISH_SUCCESS,
      data: toAssessmentResponse(publishedAssessment),
    };
  });
};

/**
 * Service Wrapper
 */
const publishAssessmentService = async (params) => {
  try {
    return await publishAssessment(params);
  } catch (error) {
    if (error instanceof ApiError) {
      logger.warn({ error: error.message }, "Publish assessment validation failed");
      throw error;
    }
    logger.error({ error: error.message, stack: error.stack }, "Unexpected error during assessment publish");
    throw new ApiError(500, error.message || "Failed to publish assessment.");
  }
};

module.exports = publishAssessmentService;
