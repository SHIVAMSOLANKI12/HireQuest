const { runTransaction } = require("../../../config/prisma");
const ApiError = require("../../../utils/ApiError");
const logger = require("../../../config/logger");

const assessmentRepository = require("../repositories/assessment.repository");
const auditLogRepository = require("../../auth/repositories/audit-log.repository");

const { toAssessmentResponse } = require("../assessment.mapper");
const {
  ASSESSMENT_STATUS,
  ASSESSMENT_MESSAGES,
  AUDIT_ACTIONS,
  AUDIT_MODULES,
} = require("../assessment.constants");
const {
  validateDuplicateTitle,
} = require("../helpers/assessment-validation.helper");
const {
  validateAssessmentDates,
} = require("../helpers/assessment-date.helper");
const {
  validateAssessmentRules,
} = require("../helpers/assessment-business.helper");

/**
 * Build Payload Helper
 */
const buildCreatePayload = (body, createdById) => {
  return {
    title: body.title.trim(),
    description: body.description?.trim() || null,
    instructions: body.instructions?.trim() || null,
    type: body.type,
    difficulty: body.difficulty,
    durationMinutes: body.durationMinutes,
    passingScore: body.passingScore,
    maximumScore: body.maximumScore,
    maxAttempts: body.maxAttempts,
    publishAt: body.publishAt ? new Date(body.publishAt) : null,
    startsAt: body.startsAt ? new Date(body.startsAt) : null,
    endsAt: body.endsAt ? new Date(body.endsAt) : null,
    status: ASSESSMENT_STATUS.DRAFT,
    createdById,
  };
};

/**
 * Create Assessment Core Logic
 */
const createAssessment = async ({ user, body }) => {
  logger.info({ userId: user?.id, title: body.title }, "Creating new assessment");

  return runTransaction(async (tx) => {
    await validateDuplicateTitle(body.title, tx);

    validateAssessmentDates(body);
    validateAssessmentRules(body);

    const payload = buildCreatePayload(body, user.id);

    const createdAssessment = await assessmentRepository.createAssessment(tx, payload);

    if (auditLogRepository && typeof auditLogRepository.createAuditLog === "function") {
      try {
        await auditLogRepository.createAuditLog(tx, {
          userId: user.id,
          action: AUDIT_ACTIONS.CREATE,
          module: AUDIT_MODULES.ASSESSMENT,
          description: `Assessment "${createdAssessment.title}" created.`,
        });
      } catch (auditErr) {
        logger.warn({ error: auditErr.message }, "Audit log record creation skipped");
      }
    }

    logger.info({ assessmentId: createdAssessment.id, userId: user?.id }, "Assessment created successfully");

    return {
      message: ASSESSMENT_MESSAGES.CREATE_SUCCESS,
      data: toAssessmentResponse(createdAssessment),
    };
  });
};

/**
 * Service Wrapper
 */
const createAssessmentService = async (params) => {
  try {
    return await createAssessment(params);
  } catch (error) {
    if (error instanceof ApiError) {
      logger.warn({ error: error.message }, "Create assessment business validation failed");
      throw error;
    }
    logger.error({ error: error.message, stack: error.stack }, "Unexpected error during assessment creation");
    throw new ApiError(500, error.message || "Failed to create assessment.");
  }
};

module.exports = createAssessmentService;
