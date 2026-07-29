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
const {
  getAssessmentOrThrow,
  validateDuplicateTitleExcludingCurrent,
} = require("../helpers/assessment-validation.helper");
const {
  validateAssessmentDates,
} = require("../helpers/assessment-date.helper");
const {
  validateAssessmentRules,
  validateEditableStatus,
  validateOwnership,
} = require("../helpers/assessment-business.helper");

/**
 * Build Partial Update Payload
 */
const buildUpdatePayload = (body) => {
  const payload = {};

  if (body.title !== undefined) payload.title = body.title.trim();
  if (body.description !== undefined) payload.description = body.description ? body.description.trim() : null;
  if (body.instructions !== undefined) payload.instructions = body.instructions ? body.instructions.trim() : null;
  if (body.type !== undefined) payload.type = body.type;
  if (body.difficulty !== undefined) payload.difficulty = body.difficulty;
  if (body.durationMinutes !== undefined) payload.durationMinutes = body.durationMinutes;
  if (body.passingScore !== undefined) payload.passingScore = body.passingScore;
  if (body.maximumScore !== undefined) payload.maximumScore = body.maximumScore;
  if (body.maxAttempts !== undefined) payload.maxAttempts = body.maxAttempts;

  if (body.publishAt !== undefined) payload.publishAt = body.publishAt ? new Date(body.publishAt) : null;
  if (body.startsAt !== undefined) payload.startsAt = body.startsAt ? new Date(body.startsAt) : null;
  if (body.endsAt !== undefined) payload.endsAt = body.endsAt ? new Date(body.endsAt) : null;

  return payload;
};

/**
 * Update Assessment Core Logic
 */
const updateAssessment = async ({ assessmentId, id, user, body }) => {
  const targetId = assessmentId || id;
  logger.info({ assessmentId: targetId, userId: user?.id }, "Updating assessment");

  return runTransaction(async (tx) => {
    const existing = await getAssessmentOrThrow(targetId, tx);

    validateOwnership(existing, user);
    validateEditableStatus(existing);

    if (body.title && body.title.trim() !== existing.title) {
      await validateDuplicateTitleExcludingCurrent(targetId, body.title.trim(), tx);
    }

    const merged = { ...existing, ...body };
    validateAssessmentDates(merged);
    validateAssessmentRules(merged);

    const updatePayload = buildUpdatePayload(body);

    if (Object.keys(updatePayload).length === 0) {
      return {
        message: ASSESSMENT_MESSAGES.UPDATE_SUCCESS,
        data: toAssessmentResponse(existing),
      };
    }

    const updatedAssessment = await assessmentRepository.updateAssessment(tx, targetId, updatePayload);

    if (auditLogRepository && typeof auditLogRepository.createAuditLog === "function") {
      try {
        await auditLogRepository.createAuditLog(tx, {
          userId: user.id,
          action: AUDIT_ACTIONS.UPDATE,
          module: AUDIT_MODULES.ASSESSMENT,
          description: `Assessment "${updatedAssessment.title}" updated.`,
        });
      } catch (auditErr) {
        logger.warn({ error: auditErr.message }, "Audit log record creation skipped");
      }
    }

    logger.info({ assessmentId: targetId, userId: user?.id }, "Assessment updated successfully");

    return {
      message: ASSESSMENT_MESSAGES.UPDATE_SUCCESS,
      data: toAssessmentResponse(updatedAssessment),
    };
  });
};

/**
 * Service Wrapper
 */
const updateAssessmentService = async (params) => {
  try {
    return await updateAssessment(params);
  } catch (error) {
    if (error instanceof ApiError) {
      logger.warn({ error: error.message }, "Update assessment validation failed");
      throw error;
    }
    logger.error({ error: error.message, stack: error.stack }, "Unexpected error during assessment update");
    throw new ApiError(500, error.message || "Failed to update assessment.");
  }
};

module.exports = updateAssessmentService;
