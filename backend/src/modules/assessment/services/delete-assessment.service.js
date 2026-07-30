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
} = require("../assessment.constants");
const { getAssessmentOrThrow } = require("../helpers/assessment-validation.helper");
const {
  validateDeleteStatus,
  validateOwnership,
} = require("../helpers/assessment-business.helper");

/**
 * Validate Dependencies Before Soft Delete
 */
const validateDependencies = async (assessmentId, tx) => {
  const [hasCandidateAttempts, hasInvitations] = await Promise.all([
    assessmentRepository.hasCandidateAttempts(tx, assessmentId),
    assessmentRepository.hasInvitations(tx, assessmentId),
  ]);

  if (hasCandidateAttempts) {
    throw new ApiError(400, "Assessment has candidate attempts and cannot be deleted.");
  }

  if (hasInvitations) {
    throw new ApiError(400, "Assessment has invitations and cannot be deleted.");
  }
};

/**
 * Build Audit Payload Helper
 */
const buildAuditPayload = (userId, assessment) => ({
  userId,
  action: AUDIT_ACTIONS.DELETE,
  module: AUDIT_MODULES.ASSESSMENT,
  entityId: assessment.id,
  description: `Assessment "${assessment.title}" deleted.`,
  metadata: {
    assessmentId: assessment.id,
    assessmentTitle: assessment.title,
    assessmentStatus: assessment.status,
  },
});

/**
 * Main Soft Delete Logic
 */
const deleteAssessment = async ({ assessmentId, id, user }) => {
  const targetId = assessmentId || id;
  logger.info({ assessmentId: targetId, userId: user?.id }, "Soft deleting assessment");

  return runTransaction(async (tx) => {
    const assessment = await getAssessmentOrThrow(targetId, tx);

    validateOwnership(assessment, user);
    validateDeleteStatus(assessment);

    await validateDependencies(targetId, tx);

    const deletedAssessment = await assessmentRepository.softDeleteAssessment(tx, targetId);

    if (auditLogRepository && typeof auditLogRepository.createAuditLog === "function") {
      try {
        await auditLogRepository.createAuditLog(tx, buildAuditPayload(user.id, assessment));
      } catch (auditErr) {
        logger.warn({ error: auditErr.message }, "Audit log record creation skipped");
      }
    }

    logger.info({ assessmentId: targetId, userId: user?.id }, "Assessment soft deleted successfully");

    return {
      message: ASSESSMENT_MESSAGES.DELETE_SUCCESS,
      data: toAssessmentResponse(deletedAssessment),
    };
  });
};

/**
 * Service Wrapper
 */
const deleteAssessmentService = async (params) => {
  try {
    return await deleteAssessment(params);
  } catch (error) {
    if (error instanceof ApiError) {
      logger.warn({ error: error.message }, "Delete assessment validation failed");
      throw error;
    }
    logger.error({ error: error.message, stack: error.stack }, "Unexpected error during assessment soft delete");
    throw new ApiError(500, error.message || "Failed to delete assessment.");
  }
};

module.exports = deleteAssessmentService;
