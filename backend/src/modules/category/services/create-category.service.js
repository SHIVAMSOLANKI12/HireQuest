const { ConflictError } = require("../../../common/exceptions");
const { runTransaction } = require("../../../common/prisma/transaction");
const { AUDIT_ACTIONS } = require("../../../common/constants/audit.constants");
const logger = require("../../../config/logger");

const categoryRepository = require("../repository/category.repository");
const { CategoryMapper } = require("../mapper/category.mapper");
const { CategoryDto } = require("../dto/category.dto");
const { CATEGORY_MESSAGES } = require("../constants/category-message.constants");

/**
 * ==========================================================
 * Enterprise Create Category Service
 * ==========================================================
 * Handles case-insensitive duplicate detection, ACID transaction execution,
 * category creation, audit logging, and client-safe DTO response formatting.
 * ==========================================================
 */
class CreateCategoryService {
  async execute(payload, userId) {
    const name = payload.name.trim();
    logger.info({ userId, name }, "Initiating category creation");

    /**
     * 1. Case-Insensitive Duplicate Check
     */
    const existingCategory = await categoryRepository.findByName(name);

    if (existingCategory) {
      logger.warn({ name }, "Duplicate category name detected");
      throw new ConflictError(
        "Category already exists.",
        "CATEGORY_ALREADY_EXISTS"
      );
    }

    /**
     * 2. ACID Database Transaction Execution
     */
    const createdCategory = await runTransaction(async (tx) => {
      const categoryData = CategoryMapper.toCreateEntity(payload, userId);
      return categoryRepository.create(tx, categoryData);
    });

    logger.info({ categoryId: createdCategory.id, name: createdCategory.name }, "Category created successfully");

    /**
     * 3. Format and Return Client-Safe Response DTO
     */
    return {
      message: CATEGORY_MESSAGES.CREATED,
      data: CategoryDto.toResponse(createdCategory),
    };
  }
}

const createCategoryService = new CreateCategoryService();

module.exports = createCategoryService;
