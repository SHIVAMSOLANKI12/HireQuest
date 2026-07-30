const { prisma } = require("../../../config/prisma");
const {
  CATEGORY_DEFAULT_SELECT,
  CATEGORY_WITH_COUNT_SELECT,
} = require("./category.select");

/**
 * Helper to resolve database client (standalone Prisma OR active transaction client tx)
 */
const getClient = (tx) =>
  tx && typeof tx === "object" && tx.questionCategory ? tx : prisma;

/**
 * ==========================================================
 * Enterprise Category Repository
 * ==========================================================
 * Pure Data Access Layer for QuestionCategory model.
 * Supports standalone & ACID transaction execution seamlessly.
 * ==========================================================
 */
class CategoryRepository {
  /**
   * Find category by ID
   */
  async findById(id, tx) {
    const db = getClient(tx);
    return db.questionCategory.findUnique({
      where: {
        id,
      },
      select: CATEGORY_DEFAULT_SELECT,
    });
  }

  /**
   * Find category by case-insensitive name
   */
  async findByName(name, tx) {
    const db = getClient(tx);
    return db.questionCategory.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
      },
    });
  }

  /**
   * Create category record
   */
  async create(tx, data) {
    const db = getClient(tx);
    return db.questionCategory.create({
      data,
      select: CATEGORY_DEFAULT_SELECT,
    });
  }

  /**
   * Update category record
   */
  async update(tx, id, data) {
    const db = getClient(tx);
    return db.questionCategory.update({
      where: {
        id,
      },
      data,
      select: CATEGORY_DEFAULT_SELECT,
    });
  }

  /**
   * Soft delete category (set isActive: false)
   */
  async softDelete(tx, id) {
    const db = getClient(tx);
    return db.questionCategory.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
      select: CATEGORY_DEFAULT_SELECT,
    });
  }

  /**
   * Restore soft-deleted category (set isActive: true)
   */
  async restore(tx, id) {
    const db = getClient(tx);
    return db.questionCategory.update({
      where: {
        id,
      },
      data: {
        isActive: true,
      },
      select: CATEGORY_DEFAULT_SELECT,
    });
  }

  /**
   * List all active categories
   */
  async listActive(tx) {
    const db = getClient(tx);
    return db.questionCategory.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      select: CATEGORY_WITH_COUNT_SELECT,
    });
  }

  /**
   * List categories with pagination, search, sorting and active filters
   */
  async listPaginated({ page = 1, limit = 10, search, sortBy = "createdAt", sortOrder = "desc", isActive = "true" }, tx) {
    const db = getClient(tx);
    const skip = (page - 1) * limit;

    const where = {};

    if (isActive !== "all") {
      where.isActive = isActive === "true";
    }

    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: "insensitive" } },
        { description: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      db.questionCategory.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: CATEGORY_WITH_COUNT_SELECT,
      }),
      db.questionCategory.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  /**
   * Count active questions associated with category
   */
  async countAssociatedQuestions(id, tx) {
    const db = getClient(tx);
    return db.question.count({
      where: {
        categoryId: id,
        deletedAt: null,
      },
    });
  }
}

module.exports = new CategoryRepository();
