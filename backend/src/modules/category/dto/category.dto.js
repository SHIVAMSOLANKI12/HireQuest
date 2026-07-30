/**
 * ==========================================================
 * Category Data Transfer Object (DTO)
 * ==========================================================
 * Sanitizes and formats Category database models into client-safe payloads.
 * ==========================================================
 */
class CategoryDto {
  /**
   * Format Detailed Single Category Response DTO (Create, GetById, Update)
   */
  static toResponse(category) {
    if (!category) return null;

    return {
      id: category.id,

      name: category.name,

      description: category.description || null,

      isActive: category.isActive,

      createdAt: category.createdAt,

      updatedAt: category.updatedAt,
    };
  }

  /**
   * Format Lightweight Category Item DTO for Public List APIs
   */
  static toListResponse(category) {
    if (!category) return null;

    return {
      id: category.id,

      name: category.name,

      description: category.description || null,

      isActive: category.isActive,
    };
  }

  /**
   * Format Category Dropdown Summary DTO (Minimalist { id, name })
   */
  static toSummary(category) {
    if (!category) return null;

    return {
      id: category.id,
      name: category.name,
    };
  }

  /**
   * Format Admin List Item DTO with Question Count
   */
  static toAdminListResponse(category) {
    if (!category) return null;

    return {
      id: category.id,

      name: category.name,

      description: category.description || null,

      isActive: category.isActive,

      questionCount: category._count?.questions || 0,

      createdAt: category.createdAt,

      updatedAt: category.updatedAt,
    };
  }

  /**
   * Format Collection Array of Categories
   */
  static toCollection(categories, transformFn = CategoryDto.toListResponse) {
    if (!Array.isArray(categories)) return [];
    return categories.map((cat) => transformFn(cat));
  }
}

module.exports = {
  CategoryDto,
};
