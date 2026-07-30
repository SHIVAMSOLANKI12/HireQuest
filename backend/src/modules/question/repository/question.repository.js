const { prisma } = require("../../../config/prisma");
const {
  QUESTION_DEFAULT_SELECT,
  QUESTION_LIST_SELECT,
} = require("./question.select");

/**
 * Helper to resolve database client (standalone Prisma OR active transaction client tx)
 */
const getClient = (tx) =>
  tx && typeof tx === "object" && tx.question ? tx : prisma;

/**
 * ==========================================================
 * Enterprise Question Repository
 * ==========================================================
 * Pure Data Access Layer for Question, QuestionOption, & QuestionTag models.
 * Supports standalone & ACID transaction execution seamlessly.
 * ==========================================================
 */
class QuestionRepository {
  /**
   * Find Question by ID with full options, category & tags
   */
  async findById(id, tx) {
    const db = getClient(tx);
    return db.question.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: QUESTION_DEFAULT_SELECT,
    });
  }

  /**
   * Find Question by exact case-insensitive title
   */
  async findByTitle(title, tx) {
    const db = getClient(tx);
    return db.question.findFirst({
      where: {
        title: {
          equals: title.trim(),
          mode: "insensitive",
        },
        deletedAt: null,
      },
    });
  }

  /**
   * Validate Category existence and active status
   */
  async validateCategoryExists(categoryId, tx) {
    const db = getClient(tx);
    const category = await db.questionCategory.findFirst({
      where: {
        id: categoryId,
        isActive: true,
      },
      select: { id: true },
    });
    return Boolean(category);
  }

  /**
   * Validate array of Tag IDs existence and active status
   */
  async validateTagsExist(tagIds = [], tx) {
    if (!tagIds.length) return true;
    const db = getClient(tx);
    const count = await db.tag.count({
      where: {
        id: { in: tagIds },
        isActive: true,
      },
    });
    return count === tagIds.length;
  }

  /**
   * Create Question record with nested options & tag associations
   */
  async create(tx, questionData, optionsData = [], tagIds = []) {
    const db = getClient(tx);

    const question = await db.question.create({
      data: {
        ...questionData,
        ...(optionsData.length > 0 && {
          options: {
            create: optionsData,
          },
        }),
        ...(tagIds.length > 0 && {
          tags: {
            create: tagIds.map((tagId) => ({
              tag: { connect: { id: tagId } },
            })),
          },
        }),
      },
      select: QUESTION_DEFAULT_SELECT,
    });

    return question;
  }

  /**
   * Update Question record
   */
  async update(tx, id, questionData, optionsData = null, tagIds = null) {
    const db = getClient(tx);

    // If options are provided, recreate them safely
    if (optionsData !== null) {
      await db.questionOption.deleteMany({
        where: { questionId: id },
      });
    }

    // If tagIds are provided, recreate tag associations
    if (tagIds !== null) {
      await db.questionTag.deleteMany({
        where: { questionId: id },
      });
    }

    return db.question.update({
      where: { id },
      data: {
        ...questionData,
        ...(optionsData !== null && {
          options: {
            create: optionsData,
          },
        }),
        ...(tagIds !== null && {
          tags: {
            create: tagIds.map((tagId) => ({
              tag: { connect: { id: tagId } },
            })),
          },
        }),
      },
      select: QUESTION_DEFAULT_SELECT,
    });
  }

  /**
   * Publish Question (Set status: PUBLISHED, publishedAt: now())
   */
  async publish(tx, id) {
    const db = getClient(tx);
    return db.question.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
      select: QUESTION_DEFAULT_SELECT,
    });
  }

  /**
   * Archive Question (Set status: ARCHIVED)
   */
  async archive(tx, id) {
    const db = getClient(tx);
    return db.question.update({
      where: { id },
      data: {
        status: "ARCHIVED",
      },
      select: QUESTION_DEFAULT_SELECT,
    });
  }

  /**
   * Soft Delete Question (Set deletedAt: now(), isActive: false)
   */
  async softDelete(tx, id) {
    const db = getClient(tx);
    return db.question.update({
      where: { id },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
      select: QUESTION_DEFAULT_SELECT,
    });
  }

  /**
   * Restore Soft Deleted Question
   */
  async restore(tx, id) {
    const db = getClient(tx);
    return db.question.update({
      where: { id },
      data: {
        isActive: true,
        deletedAt: null,
      },
      select: QUESTION_DEFAULT_SELECT,
    });
  }

  /**
   * List Questions with pagination, search, filters & sorting
   */
  async listPaginated({ page = 1, limit = 10, search, type, difficulty, status, categoryId, tagId, sortBy = "createdAt", sortOrder = "desc", isActive = "true" }, tx) {
    const db = getClient(tx);
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
    };

    if (isActive !== "all") {
      where.isActive = isActive === "true";
    }

    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;

    if (tagId) {
      where.tags = {
        some: {
          tagId,
        },
      };
    }

    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: "insensitive" } },
        { description: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      db.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: QUESTION_LIST_SELECT,
      }),
      db.question.count({ where }),
    ]);

    return { data, total, page, limit };
  }
}

module.exports = new QuestionRepository();
