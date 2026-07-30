const questionRepository = require("../repository/question.repository");
const { QuestionDto } = require("../dto/question.dto");
const { QUESTION_MESSAGES } = require("../question.constants");
const logger = require("../../../config/logger");

/**
 * ==========================================================
 * Enterprise List Questions Service
 * ==========================================================
 * Retrieves paginated, searched, sorted, and filtered question records.
 * ==========================================================
 */
class GetQuestionsService {
  async execute(queryParams = {}) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const search = queryParams.search || "";
    const type = queryParams.type || null;
    const difficulty = queryParams.difficulty || null;
    const status = queryParams.status || null;
    const categoryId = queryParams.categoryId || null;
    const tagId = queryParams.tagId || null;
    const sortBy = queryParams.sortBy || "createdAt";
    const sortOrder = queryParams.sortOrder || "desc";
    const isActive = queryParams.isActive !== undefined ? queryParams.isActive : "true";

    logger.info({ page, limit, search, type, difficulty, status, categoryId, tagId }, "Fetching questions list");

    const result = await questionRepository.listPaginated({
      page,
      limit,
      search,
      type,
      difficulty,
      status,
      categoryId,
      tagId,
      sortBy,
      sortOrder,
      isActive,
    });

    const items = result.data.map((q) => QuestionDto.toListResponse(q));

    return {
      message: QUESTION_MESSAGES.QUESTIONS_FETCHED || "Questions retrieved successfully.",
      data: items,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit) || 1,
      },
    };
  }
}

const getQuestionsService = new GetQuestionsService();

module.exports = getQuestionsService;
