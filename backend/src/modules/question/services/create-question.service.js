const {
  ConflictError,
  NotFoundError,
  ValidationError,
} = require("../../../common/exceptions");

const { runTransaction } = require("../../../common/prisma/transaction");
const { sanitizeQuestionSnapshot } = require("../../../common/utils/sanitize-snapshot");
const { AUDIT_ACTIONS } = require("../../../common/constants/audit.constants");
const logger = require("../../../config/logger");

const questionRepository = require("../repository/question.repository");
const { QuestionMapper } = require("../mapper/question.mapper");
const { QuestionDto } = require("../dto/question.dto");
const { QUESTION_MESSAGES } = require("../question.constants");

/**
 * ==========================================================
 * Enterprise Refactored Create Question Service
 * ==========================================================
 * Executes ACID transaction, custom exception handling,
 * option & tag batch creation, sanitized version snapshots,
 * audit logging, and response DTO formatting.
 * ==========================================================
 */
class CreateQuestionService {
  async execute(payload, userId) {
    logger.info({ userId, title: payload.title, type: payload.type }, "Initiating enterprise question creation");

    /**
     * 1. Duplicate Question Title Validation
     */
    const duplicate = await questionRepository.findDuplicateQuestion(payload.title);

    if (duplicate) {
      logger.warn({ title: payload.title }, "Duplicate question title detected");
      throw new ConflictError(
        "Question already exists.",
        "QUESTION_ALREADY_EXISTS"
      );
    }

    /**
     * 2. Category Existence & Active Status Validation
     */
    const category = await questionRepository.findCategoryById(payload.categoryId);

    if (!category) {
      logger.warn({ categoryId: payload.categoryId }, "Invalid or inactive category ID provided");
      throw new NotFoundError(
        "Question category not found.",
        "QUESTION_CATEGORY_NOT_FOUND"
      );
    }

    /**
     * 3. Tags Existence & Active Status Validation
     */
    if (Array.isArray(payload.tagIds) && payload.tagIds.length > 0) {
      const existingTags = await questionRepository.findTagsByIds(payload.tagIds);

      if (existingTags.length !== payload.tagIds.length) {
        logger.warn({ providedTagIds: payload.tagIds, foundCount: existingTags.length }, "One or more tag IDs are invalid or inactive");
        throw new ValidationError(
          "Invalid question tags.",
          [
            {
              field: "tagIds",
              message: "One or more tags are invalid.",
            },
          ],
          "QUESTION_INVALID_TAGS"
        );
      }
    }

    /**
     * 4. ACID Database Transaction Execution
     */
    const createdQuestion = await runTransaction(async (tx) => {
      // 4a. Map and Create Question entity
      const questionEntityData = QuestionMapper.toCreateQuestion(payload, userId);
      const question = await questionRepository.createQuestion(tx, questionEntityData);

      // 4b. Batch Create Options (if objective question)
      if (Array.isArray(payload.options) && payload.options.length > 0) {
        const optionEntities = QuestionMapper.toQuestionOptions(question.id, payload.options);
        await questionRepository.createOptions(tx, optionEntities);
      }

      // 4c. Batch Create Tags Junction Records
      if (Array.isArray(payload.tagIds) && payload.tagIds.length > 0) {
        const tagJunctionEntities = QuestionMapper.toQuestionTags(question.id, payload.tagIds);
        await questionRepository.createQuestionTags(tx, tagJunctionEntities);
      }

      // 4d. Create Sanitized Initial Version Snapshot (v1)
      const sanitizedSnapshot = sanitizeQuestionSnapshot({
        ...question,
        options: payload.options || [],
        tags: payload.tagIds ? payload.tagIds.map((id) => ({ tagId: id })) : [],
      });

      const versionPayload = QuestionMapper.toQuestionVersion(
        { ...question, version: 1, snapshot: sanitizedSnapshot },
        userId
      );
      versionPayload.snapshot = sanitizedSnapshot;
      await questionRepository.createVersion(tx, versionPayload);

      // 4e. Record Audit Log Entry
      const auditPayload = QuestionMapper.toAuditLog(
        question.id,
        userId,
        AUDIT_ACTIONS.CREATE,
        sanitizedSnapshot,
        `Question "${question.title}" created successfully.`
      );
      await questionRepository.createAuditLog(tx, auditPayload);

      return question;
    });

    /**
     * 5. Fetch Full Created Question with Relations
     */
    const completeQuestion = await questionRepository.findQuestionWithRelations(createdQuestion.id);

    logger.info({ questionId: createdQuestion.id, userId }, "Question created successfully");

    /**
     * 6. Format and Return Client-Safe DTO
     */
    return {
      message: QUESTION_MESSAGES.CREATE_SUCCESS,
      data: QuestionDto.toResponse(completeQuestion),
    };
  }
}

const createQuestionService = new CreateQuestionService();

module.exports = createQuestionService;
