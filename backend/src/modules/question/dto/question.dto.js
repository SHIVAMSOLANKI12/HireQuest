/**
 * ==========================================================
 * Question Data Transfer Object (DTO)
 * ==========================================================
 * Sanitizes and formats database objects into client-safe responses.
 * ==========================================================
 */

class QuestionDto {
  /**
   * Format Detailed Single Question Response DTO
   */
  static toResponse(question) {
    if (!question) return null;

    return {
      id: question.id,

      title: question.title,

      description: question.description || null,

      explanation: question.explanation || null,

      type: question.type,

      difficulty: question.difficulty,

      status: question.status,

      marks: question.marks,

      negativeMarks: question.negativeMarks,

      estimatedTime: question.estimatedTime || null,

      shuffleOptions: question.shuffleOptions,

      version: question.version || 1,

      publishedAt: question.publishedAt || null,

      category: question.category
        ? {
            id: question.category.id,
            name: question.category.name,
          }
        : null,

      tags:
        question.tags?.map((item) => ({
          id: item.tag ? item.tag.id : item.id,
          name: item.tag ? item.tag.name : item.name,
        })) ?? [],

      options:
        question.options?.map((option) => ({
          id: option.id,
          optionText: option.optionText,
          isCorrect: option.isCorrect,
          sequence: option.sequence,
          explanation: option.explanation || null,
        })) ?? [],

      attachments:
        question.attachments?.map((att) => ({
          id: att.id,
          type: att.type,
          fileName: att.fileName,
          originalName: att.originalName,
          fileUrl: att.fileUrl,
        })) ?? [],

      createdAt: question.createdAt,

      updatedAt: question.updatedAt,
    };
  }

  /**
   * Format Lightweight Summary List Item DTO
   */
  static toListResponse(question) {
    if (!question) return null;

    return {
      id: question.id,

      title: question.title,

      type: question.type,

      difficulty: question.difficulty,

      status: question.status,

      marks: question.marks,

      createdAt: question.createdAt,
    };
  }

  /**
   * Format Paginated Questions List Response DTO
   */
  static toPaginatedResponse({ data = [], total = 0, page = 1, limit = 10 }) {
    return {
      items: data.map((item) => QuestionDto.toListResponse(item)),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }
}

module.exports = {
  QuestionDto,
};
