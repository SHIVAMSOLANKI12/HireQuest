const { NotFoundError, BadRequestError } = require("../../../common/exceptions");
const { runTransaction } = require("../../../common/prisma/transaction");
const questionRepository = require("../repository/question.repository");
const { QuestionDto } = require("../dto/question.dto");
const { QUESTION_MESSAGES, QUESTION_ERRORS } = require("../question.constants");
const logger = require("../../../config/logger");

/**
 * ==========================================================
 * Enterprise Publish Question Service
 * ==========================================================
 * Transition question status to PUBLISHED and set publishedAt timestamp.
 * ==========================================================
 */
class PublishQuestionService {
  async execute(id, userId) {
    logger.info({ id, userId }, "Initiating question publication");

    const existing = await questionRepository.findById(id);
    if (!existing) {
      logger.warn({ id }, "Question not found for publication");
      throw new NotFoundError(
        "Question not found.",
        QUESTION_ERRORS.NOT_FOUND || "QUESTION_NOT_FOUND"
      );
    }

    if (existing.status === "PUBLISHED") {
      throw new BadRequestError(
        "Question is already published.",
        "QUESTION_ALREADY_PUBLISHED"
      );
    }

    // Verify objective questions have valid options before publishing
    const isObjective = [
      "SINGLE_CHOICE",
      "MULTIPLE_CHOICE",
      "TRUE_FALSE",
    ].includes(existing.type);

    if (isObjective) {
      if (!existing.options || existing.options.length < 2) {
        throw new BadRequestError(
          "Objective questions must have at least 2 options to be published.",
          QUESTION_ERRORS.CANNOT_PUBLISH || "QUESTION_CANNOT_BE_PUBLISHED"
        );
      }
      const hasCorrect = existing.options.some((o) => o.isCorrect);
      if (!hasCorrect) {
        throw new BadRequestError(
          "Objective questions must have at least one correct option to be published.",
          QUESTION_ERRORS.CANNOT_PUBLISH || "QUESTION_CANNOT_BE_PUBLISHED"
        );
      }
    }

    const publishedQuestion = await runTransaction(async (tx) => {
      return questionRepository.publish(tx, id);
    });

    logger.info({ id }, "Question published successfully");

    return {
      message: QUESTION_MESSAGES.PUBLISH_SUCCESS || "Question published successfully.",
      data: QuestionDto.toResponse(publishedQuestion),
    };
  }
}

const publishQuestionService = new PublishQuestionService();

module.exports = publishQuestionService;
