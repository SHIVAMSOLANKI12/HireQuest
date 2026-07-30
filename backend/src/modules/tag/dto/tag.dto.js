/**
 * ==========================================================
 * Tag Data Transfer Object (DTO)
 * ==========================================================
 * Sanitizes and formats Tag database models into client-safe payloads.
 * ==========================================================
 */
class TagDto {
  /**
   * Format Detailed Single Tag Response DTO (Create, GetById, Update)
   */
  static toResponse(tag) {
    if (!tag) return null;

    return {
      id: tag.id,

      name: tag.name,

      description: tag.description || null,

      isActive: tag.isActive,

      createdAt: tag.createdAt,

      updatedAt: tag.updatedAt,
    };
  }

  /**
   * Format Lightweight Tag Item DTO for Public List APIs
   */
  static toListResponse(tag) {
    if (!tag) return null;

    return {
      id: tag.id,

      name: tag.name,

      description: tag.description || null,

      isActive: tag.isActive,
    };
  }

  /**
   * Format Tag Dropdown Summary DTO (Minimalist { id, name })
   */
  static toSummary(tag) {
    if (!tag) return null;

    return {
      id: tag.id,
      name: tag.name,
    };
  }

  /**
   * Format Admin List Item DTO with Question Count
   */
  static toAdminListResponse(tag) {
    if (!tag) return null;

    return {
      id: tag.id,

      name: tag.name,

      description: tag.description || null,

      isActive: tag.isActive,

      questionCount: tag._count?.questionTags || 0,

      createdAt: tag.createdAt,

      updatedAt: tag.updatedAt,
    };
  }

  /**
   * Format Collection Array of Tags
   */
  static toCollection(tags, transformFn = TagDto.toListResponse) {
    if (!Array.isArray(tags)) return [];
    return tags.map((t) => transformFn(t));
  }
}

module.exports = {
  TagDto,
};
