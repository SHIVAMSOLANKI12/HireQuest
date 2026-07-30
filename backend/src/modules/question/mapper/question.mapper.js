/**
 * ==========================================================
 * Question Data Mapper
 * ==========================================================
 * Transforms HTTP request payloads into database entity models
 * and prepares version snapshots & audit logs.
 * ==========================================================
 */

class QuestionMapper {
  /**
   * Convert API request data into Question entity payload
   */
  static toCreateQuestion(data, userId) {
    return {
      title: data.title.trim(),

      description: data.description?.trim() || null,

      explanation: data.explanation?.trim() || null,

      type: data.type,

      difficulty: data.difficulty,

      status: data.status,

      marks: data.marks,

      negativeMarks: data.negativeMarks,

      estimatedTime: data.estimatedTime ?? null,

      shuffleOptions: data.shuffleOptions,

      categoryId: data.categoryId,

      createdById: userId,

      updatedById: userId,
    };
  }

  /**
   * Convert request options array into QuestionOption payloads
   */
  static toQuestionOptions(questionId, options) {
    if (!Array.isArray(options) || options.length === 0) return [];
    return options.map((option) => ({
      questionId,

      optionText: option.optionText.trim(),

      isCorrect: option.isCorrect,

      sequence: option.sequence,

      explanation: option.explanation?.trim() || null,
    }));
  }

  /**
   * Convert tag IDs array into QuestionTag junction payloads
   */
  static toQuestionTags(questionId, tagIds) {
    if (!Array.isArray(tagIds) || tagIds.length === 0) return [];
    return tagIds.map((tagId) => ({
      questionId,
      tagId,
    }));
  }

  /**
   * Build Question Version Snapshot payload
   */
  static toQuestionVersion(question, userId) {
    return {
      questionId: question.id,

      version: question.version || 1,

      snapshot: question,

      createdById: userId,
    };
  }

  /**
   * Build Question Audit Log payload
   */
  static toAuditLog(questionId, userId, action, newValue, description = "Question created successfully") {
    return {
      questionId,

      userId,

      action,

      oldValue: null,

      newValue: newValue || null,

      description,
    };
  }
}

module.exports = {
  QuestionMapper,
};
