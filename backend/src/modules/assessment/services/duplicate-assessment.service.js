const { runTransaction } = require("../../../config/prisma");
const ApiError = require("../../../utils/ApiError");
const logger = require("../../../config/logger");

const assessmentRepository = require("../repositories/assessment.repository");
const auditLogRepository = require("../../auth/repositories/audit-log.repository");

const { toAssessmentResponse } = require("../assessment.mapper");
const {
  ASSESSMENT_STATUS,
  AUDIT_ACTIONS,
  AUDIT_MODULES,
  ASSESSMENT_MESSAGES,
} = require("../assessment.constants");
const { getAssessmentOrThrow } = require("../helpers/assessment-validation.helper");

/**
 * Generate Unique Duplicate Title
 */
const generateDuplicateTitle = async (title, tx) => {
  let counter = 1;
  let duplicateTitle = `Copy of ${title}`;

  while (true) {
    const existing = await assessmentRepository.findAssessmentByTitle(tx, duplicateTitle);

    if (!existing) {
      return duplicateTitle;
    }

    counter++;
    duplicateTitle = `Copy (${counter}) of ${title}`;
  }
};

/**
 * Duplicate Assessment Core Logic
 */
const duplicateAssessment = async ({ assessmentId, id, user }) => {
  const targetId = assessmentId || id;
  logger.info({ assessmentId: targetId, userId: user?.id }, "Duplicating assessment");

  return runTransaction(async (tx) => {
    const assessment = await getAssessmentOrThrow(targetId, tx);

    const duplicateTitle = await generateDuplicateTitle(assessment.title, tx);

    const created = await assessmentRepository.createAssessment(tx, {
      title: duplicateTitle,
      description: assessment.description,
      instructions: assessment.instructions,
      type: assessment.type,
      difficulty: assessment.difficulty,
      durationMinutes: assessment.durationMinutes,
      passingScore: assessment.passingScore,
      maximumScore: assessment.maximumScore,
      maxAttempts: assessment.maxAttempts,
      status: ASSESSMENT_STATUS.DRAFT,
      createdById: user?.id || assessment.createdById,
    });

    if (Array.isArray(assessment.games) && assessment.games.length > 0) {
      await assessmentRepository.createAssessmentGames(
        tx,
        assessment.games.map((game) => ({
          assessmentId: created.id,
          gameId: game.gameId,
          sequence: game.sequence,
          weight: game.weight,
        }))
      );
    }

    if (Array.isArray(assessment.questions) && assessment.questions.length > 0) {
      await assessmentRepository.createAssessmentQuestions(
        tx,
        assessment.questions.map((question) => ({
          assessmentId: created.id,
          questionId: question.questionId,
          sequence: question.sequence,
          marks: question.marks,
          negativeMarks: question.negativeMarks,
        }))
      );
    }

    if (user?.id && auditLogRepository && typeof auditLogRepository.createAuditLog === "function") {
      await auditLogRepository.createAuditLog(tx, {
        userId: user.id,
        action: AUDIT_ACTIONS.CREATE,
        module: AUDIT_MODULES.ASSESSMENT,
        description: `Assessment duplicated from "${assessment.title}".`,
      });
    }

    const fullDuplicated = await assessmentRepository.findAssessmentById(tx, created.id);

    return {
      message: ASSESSMENT_MESSAGES.DUPLICATE_SUCCESS,
      data: toAssessmentResponse(fullDuplicated || created),
    };
  });
};

/**
 * Service Wrapper
 */
const duplicateAssessmentService = async (params) => {
  try {
    return await duplicateAssessment(params);
  } catch (error) {
    if (error instanceof ApiError) {
      logger.warn({ error: error.message }, "Duplicate assessment validation failed");
      throw error;
    }
    logger.error({ error: error.message, stack: error.stack }, "Unexpected error during assessment duplication");
    throw new ApiError(500, error.message || "Failed to duplicate assessment.");
  }
};

module.exports = duplicateAssessmentService;
