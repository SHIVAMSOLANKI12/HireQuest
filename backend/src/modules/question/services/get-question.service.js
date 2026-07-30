const { NotFoundError } = require("../../../common/exceptions");
const questionRepository = require("../repository/question.repository");
const { QuestionDto } = require("../dto/question.dto");
const { QUESTION_MESSAGES, QUESTION_ERRORS } = require("../question.constants");
const logger = require("../../../config/logger");

/**
 * ==========================================================
 * Enterprise Get Question By ID Service
 * ==========================================================
 * Fetches a single question record by unique ID.
 * ==========================================================
 */
class GetQuestionService {
  async execute(id) {
    logger.info({ id }, "Fetching question by ID");

    const question = await questionRepository.findById(id);

    if (!question) {
      logger.warn({ id }, "Question not found");
      throw new NotFoundError(
        "Question not found.",
        QUESTION_ERRORS.NOT_FOUND || "QUESTION_NOT_FOUND"
      );
    }

    return {
      message: QUESTION_MESSAGES.QUESTION_FETCHED || "Question fetched successfully.",
      data: QuestionDto.toResponse(question),
    };
  }
}

const getQuestionService = new GetQuestionService();

module.exports = getQuestionService;
