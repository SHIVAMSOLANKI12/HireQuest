const { NotFoundError, ConflictError, BadRequestError } = require("../../../common/exceptions");
const { runTransaction } = require("../../../common/prisma/transaction");
const categoryRepository = require("../repository/category.repository");
const { CategoryDto } = require("../dto/category.dto");
const { CATEGORY_MESSAGES } = require("../constants/category-message.constants");
const { CATEGORY_ERRORS } = require("../constants/category-error.constants");
const logger = require("../../../config/logger");

/**
 * ==========================================================
 * Enterprise Soft Delete Category Service
 * ==========================================================
 * Verifies category exists, checks for active question associations,
 * and sets isActive: false within an ACID transaction.
 * ==========================================================
 */
class DeleteCategoryService {
  async execute(id, userId) {
    logger.info({ id, userId }, "Initiating category soft deletion");

    // 1. Check existence
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      logger.warn({ id }, "Category not found for soft deletion");
      throw new NotFoundError(
        "Question category not found.",
        CATEGORY_ERRORS.NOT_FOUND
      );
    }

    // 2. Prevent deletion if already inactive
    if (!existing.isActive) {
      logger.warn({ id }, "Category is already deleted/inactive");
      throw new BadRequestError(
        "Category is already deleted.",
        "CATEGORY_ALREADY_DELETED"
      );
    }

    // 3. Verify no active associated questions
    const questionCount = await categoryRepository.countAssociatedQuestions(id);
    if (questionCount > 0) {
      logger.warn({ id, questionCount }, "Cannot delete category with associated active questions");
      throw new ConflictError(
        "Cannot delete category as it is currently associated with active questions.",
        CATEGORY_ERRORS.IN_USE
      );
    }

    // 4. Soft delete transaction
    const deletedCategory = await runTransaction(async (tx) => {
      return categoryRepository.softDelete(tx, id);
    });

    logger.info({ id }, "Category soft-deleted successfully");

    return {
      message: CATEGORY_MESSAGES.DELETED,
      data: CategoryDto.toResponse(deletedCategory),
    };
  }
}

const deleteCategoryService = new DeleteCategoryService();

module.exports = deleteCategoryService;
