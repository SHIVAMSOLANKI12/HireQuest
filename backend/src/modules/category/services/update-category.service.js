const { NotFoundError, ConflictError } = require("../../../common/exceptions");
const { runTransaction } = require("../../../common/prisma/transaction");
const categoryRepository = require("../repository/category.repository");
const { CategoryMapper } = require("../mapper/category.mapper");
const { CategoryDto } = require("../dto/category.dto");
const { CATEGORY_MESSAGES } = require("../constants/category-message.constants");
const { CATEGORY_ERRORS } = require("../constants/category-error.constants");
const logger = require("../../../config/logger");

/**
 * ==========================================================
 * Enterprise Update Category Service
 * ==========================================================
 * Handles category property updates with duplicate name checking & transactions.
 * ==========================================================
 */
class UpdateCategoryService {
  async execute(id, payload, userId) {
    logger.info({ id, userId, name: payload.name }, "Initiating category update");

    // 1. Verify existence
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      logger.warn({ id }, "Category not found for update");
      throw new NotFoundError(
        "Question category not found.",
        CATEGORY_ERRORS.NOT_FOUND
      );
    }

    // 2. Duplicate check if name is being changed
    if (payload.name && payload.name.trim().toLowerCase() !== existing.name.toLowerCase()) {
      const duplicate = await categoryRepository.findByName(payload.name.trim());
      if (duplicate && duplicate.id !== id) {
        logger.warn({ id, newName: payload.name }, "Duplicate category name detected during update");
        throw new ConflictError(
          "A category with this name already exists.",
          CATEGORY_ERRORS.ALREADY_EXISTS
        );
      }
    }

    // 3. Execute Transaction Update
    const updatedCategory = await runTransaction(async (tx) => {
      const updateData = CategoryMapper.toUpdateEntity(payload, userId);
      return categoryRepository.update(tx, id, updateData);
    });

    logger.info({ id, name: updatedCategory.name }, "Category updated successfully");

    return {
      message: CATEGORY_MESSAGES.UPDATED,
      data: CategoryDto.toResponse(updatedCategory),
    };
  }
}

const updateCategoryService = new UpdateCategoryService();

module.exports = updateCategoryService;
