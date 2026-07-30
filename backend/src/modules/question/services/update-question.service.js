const { NotFoundError, ConflictError, BadRequestError } = require("../../../common/exceptions");
const { runTransaction } = require("../../../common/prisma/transaction");
const questionRepository = require("../repository/question.repository");
const { QuestionMapper } = require("../mapper/question.mapper");
const { QuestionDto } = require("../dto/question.dto");
const { QUESTION_MESSAGES, QUESTION_ERRORS } = require("../question.constants");
const logger = require("../../../config/logger");

/**
 * ==========================================================
 * Enterprise Update Question Service
 * ==========================================================
 * Handles question property & option updates within an ACID transaction.
 * ==========================================================
 */
class UpdateQuestionService {
  async execute(id, payload, userId) {
    logger.info({ id, userId, title: payload.title }, "Initiating question update");

    // 1. Verify existence
    const existing = await questionRepository.findById(id);
    if (!existing) {
      logger.warn({ id }, "Question not found for update");
      throw new NotFoundError(
        "Question not found.",
        QUESTION_ERRORS.NOT_FOUND || "QUESTION_NOT_FOUND"
      );
    }

    // 2. Duplicate title check if changing
    if (payload.title && payload.title.trim().toLowerCase() !== existing.title.toLowerCase()) {
      const duplicate = await questionRepository.findByTitle(payload.title.trim());
      if (duplicate && duplicate.id !== id) {
        logger.warn({ id, newTitle: payload.title }, "Duplicate question title detected during update");
        throw new ConflictError(
          "A question with this title already exists.",
          QUESTION_ERRORS.DUPLICATE_TITLE || "QUESTION_ALREADY_EXISTS"
        );
      }
    }

    // 3. Category validation if changing
    if (payload.categoryId) {
      const categoryExists = await questionRepository.validateCategoryExists(payload.categoryId);
      if (!categoryExists) {
        throw new BadRequestError(
          "Selected category does not exist or is inactive.",
          QUESTION_ERRORS.INVALID_CATEGORY || "INVALID_CATEGORY"
        );
      }
    }

    // 4. Tags validation if changing
    if (Array.isArray(payload.tagIds) && payload.tagIds.length > 0) {
      const tagsExist = await questionRepository.validateTagsExist(payload.tagIds);
      if (!tagsExist) {
        throw new BadRequestError(
          "One or more selected tags do not exist or are inactive.",
          QUESTION_ERRORS.INVALID_TAGS || "INVALID_TAGS"
        );
      }
    }

    // 5. Execute Transaction Update
    const updatedQuestion = await runTransaction(async (tx) => {
      const updateData = QuestionMapper.toUpdateEntity(payload, userId);
      const optionsData = payload.options ? QuestionMapper.toOptionEntities(payload.options) : null;
      const tagIds = payload.tagIds ? payload.tagIds : null;

      return questionRepository.update(tx, id, updateData, optionsData, tagIds);
    });

    logger.info({ id, title: updatedQuestion.title }, "Question updated successfully");

    return {
      message: QUESTION_MESSAGES.UPDATE_SUCCESS || "Question updated successfully.",
      data: QuestionDto.toResponse(updatedQuestion),
    };
  }
}

const updateQuestionService = new UpdateQuestionService();

module.exports = updateQuestionService;
