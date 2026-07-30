/**
 * ==========================================================
 * Tag Data Mapper
 * ==========================================================
 * Converts HTTP request objects into persistence-ready entities,
 * handles string normalization, and builds audit & version snapshots.
 * ==========================================================
 */

class TagMapper {
  /**
   * Normalize tag name for case-insensitive duplicate checking
   * Example: "   Java   Script   " => "java script"
   */
  static normalizeName(name) {
    if (typeof name !== "string") return "";
    return name
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();
  }

  /**
   * Convert validated API request data into Tag database creation payload
   */
  static toCreateEntity(data, userId) {
    return {
      name: data.name.trim().replace(/\s+/g, " "),

      description: data.description ? data.description.trim() : null,

      isActive: true,
    };
  }

  /**
   * Convert validated API request data into Tag database update payload
   */
  static toUpdateEntity(data, userId) {
    const payload = {};

    if (data.name) {
      payload.name = data.name.trim().replace(/\s+/g, " ");
    }

    if (data.description !== undefined) {
      payload.description = data.description ? data.description.trim() : null;
    }

    if (data.isActive !== undefined) {
      payload.isActive = Boolean(data.isActive);
    }

    return payload;
  }

  /**
   * Build Audit Trail Payload
   */
  static toAuditPayload(tag, action) {
    return {
      entity: "QUESTION_TAG",

      entityId: tag.id,

      action,

      snapshot: TagMapper.toVersionSnapshot(tag),
    };
  }

  /**
   * Build Version Snapshot
   */
  static toVersionSnapshot(tag) {
    if (!tag) return null;

    return {
      id: tag.id,

      name: tag.name,

      description: tag.description || null,

      isActive: tag.isActive,
    };
  }
}

module.exports = {
  TagMapper,
};
