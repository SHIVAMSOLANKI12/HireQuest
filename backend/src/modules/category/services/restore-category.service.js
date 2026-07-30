const { NotFoundError, BadRequestError } = require("../../../common/exceptions");
const { runTransaction } = require("../../../common/prisma/transaction");
const categoryRepository = require("../repository/category.repository");
const { CategoryDto } = require("../dto/category.dto");
const { CATEGORY_MESSAGES } = require("../constants/category-message.constants");
const { CATEGORY_ERRORS } = require("../constants/category-error.constants");
const logger = require("../../../config/logger");

/**
 * ==========================================================
 * Enterprise Restore Category Service
 * ==========================================================
 * Restores a soft-deleted category by setting isActive: true.
 * ==========================================================
 */
class RestoreCategoryService {
  async execute(id, userId) {
    logger.info({ id, userId }, "Initiating category restoration");

    const existing = await categoryRepository.findById(id);
    if (!existing) {
      logger.warn({ id }, "Category not found for restoration");
      throw new NotFoundError(
        "Question category not found.",
        CATEGORY_ERRORS.NOT_FOUND
      );
    }

    if (existing.isActive) {
      logger.warn({ id }, "Category is already active");
      throw new BadRequestError(
        "Category is already active.",
        CATEGORY_ERRORS.ALREADY_ACTIVE
      );
    }

    const restoredCategory = await runTransaction(async (tx) => {
      return categoryRepository.restore(tx, id);
    });

    logger.info({ id }, "Category restored successfully");

    return {
      message: CATEGORY_MESSAGES.RESTORED,
      data: CategoryDto.toResponse(restoredCategory),
    };
  }
}

const restoreCategoryService = new RestoreCategoryService();

module.exports = restoreCategoryService;
