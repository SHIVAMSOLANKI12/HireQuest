const { NotFoundError, BadRequestError } = require("../../../common/exceptions");
const { runTransaction } = require("../../../common/prisma/transaction");
const questionRepository = require("../repository/question.repository");
const { QuestionDto } = require("../dto/question.dto");
const { QUESTION_MESSAGES, QUESTION_ERRORS } = require("../question.constants");
const logger = require("../../../config/logger");

/**
 * ==========================================================
 * Enterprise Soft Delete Question Service
 * ==========================================================
 * Verifies question exists and sets isActive: false, deletedAt: now() within an ACID transaction.
 * ==========================================================
 */
class DeleteQuestionService {
  async execute(id, userId) {
    logger.info({ id, userId }, "Initiating question soft deletion");

    const existing = await questionRepository.findById(id);
    if (!existing) {
      logger.warn({ id }, "Question not found for soft deletion");
      throw new NotFoundError(
        "Question not found.",
        QUESTION_ERRORS.NOT_FOUND || "QUESTION_NOT_FOUND"
      );
    }

    if (!existing.isActive) {
      throw new BadRequestError(
        "Question is already deleted.",
        "QUESTION_ALREADY_DELETED"
      );
    }

    const deletedQuestion = await runTransaction(async (tx) => {
      return questionRepository.softDelete(tx, id);
    });

    logger.info({ id }, "Question soft-deleted successfully");

    return {
      message: QUESTION_MESSAGES.DELETE_SUCCESS || "Question deleted successfully.",
      data: QuestionDto.toResponse(deletedQuestion),
    };
  }
}

const deleteQuestionService = new DeleteQuestionService();

module.exports = deleteQuestionService;
