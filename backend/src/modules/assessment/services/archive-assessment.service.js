const { runTransaction } = require("../../../config/prisma");
const ApiError = require("../../../utils/ApiError");
const logger = require("../../../config/logger");

const assessmentRepository = require("../repositories/assessment.repository");
const auditLogRepository = require("../../auth/repositories/audit-log.repository");

const { toAssessmentResponse } = require("../assessment.mapper");
const {
  ASSESSMENT_STATUS,
  ASSESSMENT_ERRORS,
  ASSESSMENT_MESSAGES,
  AUDIT_ACTIONS,
  AUDIT_MODULES,
} = require("../assessment.constants");
const { getAssessmentOrThrow } = require("../helpers/assessment-validation.helper");
const { validateOwnership } = require("../helpers/assessment-business.helper");

/**
 * Validate Archive Request Rules
 */
const validateArchiveRequest = (assessment) => {
  if (assessment.status === ASSESSMENT_STATUS.ARCHIVED) {
    throw new ApiError(400, ASSESSMENT_ERRORS.ALREADY_ARCHIVED);
  }
};

/**
 * Core Archive Assessment Logic
 */
const archiveAssessment = async ({ assessmentId, id, user }) => {
  const targetId = assessmentId || id;
  logger.info({ assessmentId: targetId, userId: user?.id }, "Archiving assessment");

  return runTransaction(async (tx) => {
    const assessment = await getAssessmentOrThrow(targetId, tx);

    validateOwnership(assessment, user);
    validateArchiveRequest(assessment);

    const archivedAssessment = await assessmentRepository.archiveAssessment(tx, targetId);

    if (auditLogRepository && typeof auditLogRepository.createAuditLog === "function") {
      try {
        await auditLogRepository.createAuditLog(tx, {
          userId: user?.id || null,
          action: AUDIT_ACTIONS.ARCHIVE,
          module: AUDIT_MODULES.ASSESSMENT,
          description: `Assessment "${archivedAssessment.title}" archived.`,
        });
      } catch (auditErr) {
        logger.warn({ error: auditErr.message }, "Audit logging skipped for archive action");
      }
    }

    logger.info({ assessmentId: targetId, userId: user?.id }, "Assessment archived successfully");

    return {
      message: ASSESSMENT_MESSAGES.ARCHIVE_SUCCESS,
      data: toAssessmentResponse(archivedAssessment),
    };
  });
};

/**
 * Service Wrapper
 */
const archiveAssessmentService = async (params) => {
  try {
    return await archiveAssessment(params);
  } catch (error) {
    if (error instanceof ApiError) {
      logger.warn({ error: error.message }, "Archive assessment validation failed");
      throw error;
    }
    logger.error({ error: error.message, stack: error.stack }, "Unexpected error during assessment archive");
    throw new ApiError(500, error.message || "Failed to archive assessment.");
  }
};

module.exports = archiveAssessmentService;
