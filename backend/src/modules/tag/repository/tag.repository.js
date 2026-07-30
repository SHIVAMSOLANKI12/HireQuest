const { prisma } = require("../../../config/prisma");
const {
  TAG_DEFAULT_SELECT,
  TAG_WITH_COUNT_SELECT,
} = require("./tag.select");

/**
 * Helper to resolve database client (standalone Prisma OR active transaction client tx)
 */
const getClient = (tx) =>
  tx && typeof tx === "object" && tx.tag ? tx : prisma;

/**
 * ==========================================================
 * Enterprise Tag Repository
 * ==========================================================
 * Pure Data Access Layer for Tag model.
 * Supports standalone & ACID transaction execution seamlessly.
 * ==========================================================
 */
class TagRepository {
  /**
   * Find tag by ID
   */
  async findById(id, tx) {
    const db = getClient(tx);
    return db.tag.findUnique({
      where: {
        id,
      },
      select: TAG_DEFAULT_SELECT,
    });
  }

  /**
   * Find tag by case-insensitive name
   */
  async findByName(name, tx) {
    const db = getClient(tx);
    return db.tag.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
      },
    });
  }

  /**
   * Create tag record
   */
  async create(tx, data) {
    const db = getClient(tx);
    return db.tag.create({
      data,
      select: TAG_DEFAULT_SELECT,
    });
  }

  /**
   * Update tag record
   */
  async update(tx, id, data) {
    const db = getClient(tx);
    return db.tag.update({
      where: {
        id,
      },
      data,
      select: TAG_DEFAULT_SELECT,
    });
  }

  /**
   * Soft delete tag (set isActive: false)
   */
  async softDelete(tx, id) {
    const db = getClient(tx);
    return db.tag.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
      select: TAG_DEFAULT_SELECT,
    });
  }

  /**
   * Restore soft-deleted tag (set isActive: true)
   */
  async restore(tx, id) {
    const db = getClient(tx);
    return db.tag.update({
      where: {
        id,
      },
      data: {
        isActive: true,
      },
      select: TAG_DEFAULT_SELECT,
    });
  }

  /**
   * List all active tags
   */
  async listActive(tx) {
    const db = getClient(tx);
    return db.tag.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      select: TAG_WITH_COUNT_SELECT,
    });
  }

  /**
   * List tags with pagination, search, sorting and active filters
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
      db.tag.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: TAG_WITH_COUNT_SELECT,
      }),
      db.tag.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  /**
   * Count active question-tag junction records associated with tag
   */
  async countAssociatedQuestions(id, tx) {
    const db = getClient(tx);
    return db.questionTag.count({
      where: {
        tagId: id,
        question: {
          deletedAt: null,
        },
      },
    });
  }
}

module.exports = new TagRepository();
