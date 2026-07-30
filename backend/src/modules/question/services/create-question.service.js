const { BadRequestError, ConflictError } = require("../../../common/exceptions");
const { runTransaction } = require("../../../common/prisma/transaction");
const logger = require("../../../config/logger");

const questionRepository = require("../repository/question.repository");
const { QuestionMapper } = require("../mapper/question.mapper");
const { QuestionDto } = require("../dto/question.dto");
const { QUESTION_MESSAGES, QUESTION_ERRORS } = require("../question.constants");

/**
 * ==========================================================
 * Enterprise Create Question Service
 * ==========================================================
 * Handles category validation, tag batch validation, duplicate title check,
 * ACID transaction execution (Question + Options + QuestionTag junction),
 * and client-safe DTO response formatting.
 * ==========================================================
 */
class CreateQuestionService {
  async execute(payload, userId) {
    const title = payload.title.trim();
    logger.info({ userId, title, categoryId: payload.categoryId }, "Initiating question creation");

    /**
     * 1. Validate Category Existence & Active Status
     */
    if (payload.categoryId) {
      const categoryExists = await questionRepository.validateCategoryExists(payload.categoryId);
      if (!categoryExists) {
        logger.warn({ categoryId: payload.categoryId }, "Selected category does not exist or is inactive");
        throw new BadRequestError(
          "Selected category does not exist or is inactive.",
          QUESTION_ERRORS.INVALID_CATEGORY || "INVALID_CATEGORY"
        );
      }
    }

    /**
     * 2. Validate Tag IDs Batch Existence & Active Status
     */
    if (Array.isArray(payload.tagIds) && payload.tagIds.length > 0) {
      const tagsExist = await questionRepository.validateTagsExist(payload.tagIds);
      if (!tagsExist) {
        logger.warn({ tagIds: payload.tagIds }, "One or more selected tags do not exist or are inactive");
        throw new BadRequestError(
          "One or more selected tags do not exist or are inactive.",
          QUESTION_ERRORS.INVALID_TAGS || "INVALID_TAGS"
        );
      }
    }

    /**
     * 3. Case-Insensitive Duplicate Title Check
     */
    const existingQuestion = await questionRepository.findByTitle(title);
    if (existingQuestion) {
      logger.warn({ title }, "Duplicate question title detected");
      throw new ConflictError(
        "A question with this title already exists.",
        QUESTION_ERRORS.ALREADY_EXISTS || "QUESTION_ALREADY_EXISTS"
      );
    }

    /**
     * 4. ACID Database Transaction Execution
     */
    const createdQuestion = await runTransaction(async (tx) => {
      const questionData = QuestionMapper.toCreateEntity(payload, userId);
      const optionsData = QuestionMapper.toOptionEntities(payload.options);

      return questionRepository.create(
        tx,
        questionData,
        optionsData,
        payload.tagIds || []
      );
    });

    logger.info({ questionId: createdQuestion.id, title: createdQuestion.title }, "Question created successfully");

    /**
     * 5. Format and Return Client-Safe DTO Response
     */
    return {
      message: QUESTION_MESSAGES.CREATE_SUCCESS || "Question created successfully.",
      data: QuestionDto.toResponse(createdQuestion),
    };
  }
}

const createQuestionService = new CreateQuestionService();

module.exports = createQuestionService;
