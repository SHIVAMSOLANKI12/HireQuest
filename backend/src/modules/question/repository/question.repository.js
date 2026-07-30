const { prisma } = require("../../../config/prisma");
const { QUESTION_SUMMARY_SELECT, QUESTION_DETAIL_SELECT } = require("./question.select");

/**
 * Helper to resolve database context (standalone Prisma OR active transaction client tx)
 */
const getClient = (tx) => (tx && typeof tx === "object" && tx.question ? tx : prisma);

/**
 * ==========================================================
 * Enterprise Question Repository
 * ==========================================================
 * Data access abstraction layer for Question domain.
 * Supports ACID transaction client delegation seamlessly.
 * ==========================================================
 */
class QuestionRepository {
  /**
   * Find Duplicate Question by Title (Case-Insensitive)
   */
  async findDuplicateQuestion(title, tx) {
    const db = getClient(tx);
    return db.question.findFirst({
      where: {
        deletedAt: null,
        title: {
          equals: title.trim(),
          mode: "insensitive",
        },
      },
      select: {
        id: true,
      },
    });
  }

  /**
   * Find Active Question Category by ID
   */
  async findCategoryById(categoryId, tx) {
    const db = getClient(tx);
    return db.questionCategory.findFirst({
      where: {
        id: categoryId,
        isActive: true,
      },
    });
  }

  /**
   * Find Active Tags by Array of Tag IDs
   */
  async findTagsByIds(tagIds, tx) {
    if (!Array.isArray(tagIds) || tagIds.length === 0) return [];
    const db = getClient(tx);
    return db.tag.findMany({
      where: {
        id: {
          in: tagIds,
        },
        isActive: true,
      },
      select: {
        id: true,
      },
    });
  }

  /**
   * Find Question by ID with Complete Relations
   */
  async findQuestionById(id, tx) {
    const db = getClient(tx);
    return db.question.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: QUESTION_DETAIL_SELECT,
    });
  }

  /**
   * Find Question with Full Relations for DTO Output
   */
  async findQuestionWithRelations(questionId, tx) {
    const db = getClient(tx);
    return db.question.findFirst({
      where: {
        id: questionId,
        deletedAt: null,
      },
      select: QUESTION_DETAIL_SELECT,
    });
  }

  /**
   * Create Question Record
   */
  async createQuestion(tx, data) {
    const db = getClient(tx);
    return db.question.create({
      data,
    });
  }

  /**
   * Batch Create Question Options
   */
  async createOptions(tx, options) {
    if (!Array.isArray(options) || options.length === 0) return;
    const db = getClient(tx);
    return db.questionOption.createMany({
      data: options,
    });
  }

  /**
   * Batch Create Question Tags (Junction Table)
   */
  async createQuestionTags(tx, tags) {
    if (!Array.isArray(tags) || tags.length === 0) return;
    const db = getClient(tx);
    return db.questionTag.createMany({
      data: tags,
    });
  }

  /**
   * Create Question Version Record
   */
  async createVersion(tx, versionData) {
    const db = getClient(tx);
    return db.questionVersion.create({
      data: versionData,
    });
  }

  /**
   * Create Question Audit Log Record
   */
  async createAuditLog(tx, auditData) {
    const db = getClient(tx);
    return db.questionAuditLog.create({
      data: auditData,
    });
  }
}

module.exports = new QuestionRepository();
