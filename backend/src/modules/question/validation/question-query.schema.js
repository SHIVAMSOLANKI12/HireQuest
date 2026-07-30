const { z } = require("zod");
const {
  QUESTION_TYPES,
  QUESTION_DIFFICULTY,
  QUESTION_STATUS,
} = require("../question.constants");

/**
 * ==========================================================
 * Question List Query Filter Zod Validation Schema
 * ==========================================================
 * Standardized query validation for GET /questions
 * ==========================================================
 */
const questionQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("10"),
    search: z.string().trim().optional(),
    type: z
      .enum([
        QUESTION_TYPES.SINGLE_CHOICE,
        QUESTION_TYPES.MULTIPLE_CHOICE,
        QUESTION_TYPES.TRUE_FALSE,
        QUESTION_TYPES.SHORT_ANSWER,
        QUESTION_TYPES.CODING,
        QUESTION_TYPES.SQL,
        QUESTION_TYPES.PUZZLE,
      ])
      .optional(),
    difficulty: z
      .enum([
        QUESTION_DIFFICULTY.EASY,
        QUESTION_DIFFICULTY.MEDIUM,
        QUESTION_DIFFICULTY.HARD,
      ])
      .optional(),
    status: z
      .enum([
        QUESTION_STATUS.DRAFT,
        QUESTION_STATUS.PUBLISHED,
        QUESTION_STATUS.ARCHIVED,
      ])
      .optional(),
    categoryId: z.string().trim().optional(),
    tagId: z.string().trim().optional(),
    sortBy: z
      .enum(["title", "createdAt", "updatedAt", "difficulty", "marks"])
      .optional()
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
    isActive: z.enum(["true", "false", "all"]).optional().default("true"),
  }),
});

module.exports = {
  questionQuerySchema,
};
