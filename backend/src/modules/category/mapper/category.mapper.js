/**
 * ==========================================================
 * Category Data Mapper
 * ==========================================================
 * Converts HTTP request objects into persistence-ready entities,
 * handles string normalization, and builds audit & version snapshots.
 * ==========================================================
 */

class CategoryMapper {
  /**
   * Normalize category name for case-insensitive duplicate checking
   * Example: "   Programming      Basics   " => "programming basics"
   */
  static normalizeName(name) {
    if (typeof name !== "string") return "";
    return name
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();
  }

  /**
   * Convert validated API request data into Category database creation payload
   */
  static toCreateEntity(data, userId) {
    return {
      name: data.name.trim().replace(/\s+/g, " "),

      description: data.description ? data.description.trim() : null,

      isActive: true,
    };
  }

  /**
   * Convert validated API request data into Category database update payload
   */
  static toUpdateEntity(data, userId) {
    const payload = {};

    if (data.name) {
      payload.name = data.name.trim().replace(/\s+/g, " ");
    }

    if (data.description !== undefined) {
      payload.description = data.description ? data.description.trim() : null;
    }

    return payload;
  }

  /**
   * Build Audit Trail Payload
   */
  static toAuditPayload(category, action) {
    return {
      entity: "QUESTION_CATEGORY",

      entityId: category.id,

      action,

      snapshot: CategoryMapper.toVersionSnapshot(category),
    };
  }

  /**
   * Build Version Snapshot
   */
  static toVersionSnapshot(category) {
    if (!category) return null;

    return {
      id: category.id,

      name: category.name,

      description: category.description || null,

      isActive: category.isActive,
    };
  }
}

module.exports = {
  CategoryMapper,
};
