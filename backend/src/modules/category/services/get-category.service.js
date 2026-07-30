const { NotFoundError } = require("../../../common/exceptions");
const categoryRepository = require("../repository/category.repository");
const { CategoryDto } = require("../dto/category.dto");
const { CATEGORY_MESSAGES } = require("../constants/category-message.constants");
const { CATEGORY_ERRORS } = require("../constants/category-error.constants");
const logger = require("../../../config/logger");

/**
 * ==========================================================
 * Enterprise Get Category By ID Service
 * ==========================================================
 * Fetches a single category record by unique ID.
 * ==========================================================
 */
class GetCategoryService {
  async execute(id) {
    logger.info({ id }, "Fetching category by ID");

    const category = await categoryRepository.findById(id);

    if (!category) {
      logger.warn({ id }, "Category not found");
      throw new NotFoundError(
        "Question category not found.",
        CATEGORY_ERRORS.NOT_FOUND
      );
    }

    return {
      message: CATEGORY_MESSAGES.FETCHED,
      data: CategoryDto.toResponse(category),
    };
  }
}

const getCategoryService = new GetCategoryService();

module.exports = getCategoryService;
