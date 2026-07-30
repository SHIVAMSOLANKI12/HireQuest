const { NotFoundError, BadRequestError } = require("../../../common/exceptions");
const { runTransaction } = require("../../../common/prisma/transaction");
const questionRepository = require("../repository/question.repository");
const { QuestionDto } = require("../dto/question.dto");
const { QUESTION_MESSAGES, QUESTION_ERRORS } = require("../question.constants");
const logger = require("../../../config/logger");

/**
 * ==========================================================
 * Enterprise Archive Question Service
 * ==========================================================
 * Transition question status to ARCHIVED.
 * ==========================================================
 */
class ArchiveQuestionService {
  async execute(id, userId) {
    logger.info({ id, userId }, "Initiating question archiving");

    const existing = await questionRepository.findById(id);
    if (!existing) {
      logger.warn({ id }, "Question not found for archiving");
      throw new NotFoundError(
        "Question not found.",
        QUESTION_ERRORS.NOT_FOUND || "QUESTION_NOT_FOUND"
      );
    }

    if (existing.status === "ARCHIVED") {
      throw new BadRequestError(
        "Question is already archived.",
        QUESTION_ERRORS.ALREADY_ARCHIVED || "ALREADY_ARCHIVED"
      );
    }

    const archivedQuestion = await runTransaction(async (tx) => {
      return questionRepository.archive(tx, id);
    });

    logger.info({ id }, "Question archived successfully");

    return {
      message: QUESTION_MESSAGES.ARCHIVE_SUCCESS || "Question archived successfully.",
      data: QuestionDto.toResponse(archivedQuestion),
    };
  }
}

const archiveQuestionService = new ArchiveQuestionService();

module.exports = archiveQuestionService;
