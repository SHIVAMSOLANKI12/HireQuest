const { z } = require("zod");
const {
  QUESTION_TYPES,
  QUESTION_DIFFICULTY,
  QUESTION_STATUS,
  QUESTION_LIMITS,
} = require("../question.constants");
const { optionSchema } = require("./create-question.schema");

/**
 * ==========================================================
 * Update Question Zod Validation Schema
 * ==========================================================
 */
const updateQuestionBodySchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, "Question title must be at least 5 characters")
      .max(1000, "Question title cannot exceed 1000 characters")
      .optional(),

    description: z.string().trim().max(5000).optional().nullable(),

    explanation: z.string().trim().max(5000).optional().nullable(),

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

    marks: z
      .number()
      .int()
      .min(QUESTION_LIMITS.MIN_MARKS)
      .max(QUESTION_LIMITS.MAX_MARKS)
      .optional(),

    negativeMarks: z.number().min(0).optional(),

    estimatedTime: z
      .number()
      .int()
      .min(QUESTION_LIMITS.MIN_ESTIMATED_TIME)
      .max(QUESTION_LIMITS.MAX_ESTIMATED_TIME)
      .optional()
      .nullable(),

    shuffleOptions: z.boolean().optional(),

    categoryId: z.string().trim().min(1).optional(),

    tagIds: z.array(z.string().trim()).optional(),

    options: z.array(optionSchema).optional(),
  })
  .strict();

const updateQuestionSchema = z.object({
  params: z.object({
    id: z.string().trim().min(1, "Question ID is required."),
  }),
  body: updateQuestionBodySchema,
});

module.exports = {
  updateQuestionSchema,
  updateQuestionBodySchema,
};
