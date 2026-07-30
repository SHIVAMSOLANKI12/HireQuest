const { z } = require("zod");
const {
  QUESTION_TYPES,
  QUESTION_DIFFICULTY,
  QUESTION_STATUS,
  QUESTION_LIMITS,
} = require("../question.constants");
const {
  validateNegativeMarks,
  validateOptionCount,
  validateDuplicateOptions,
  validateCorrectAnswers,
} = require("./rules");

/**
 * Option Schema Validation
 */
const optionSchema = z.object({
  optionText: z
    .string()
    .trim()
    .min(1, "Option text is required")
    .max(500, "Option text cannot exceed 500 characters"),

  isCorrect: z.boolean(),

  sequence: z
    .number({
      invalid_type_error: "Sequence must be a number",
    })
    .int()
    .positive("Sequence must be greater than 0"),
});

/**
 * Create Question Body Zod Validation Schema
 */
const createQuestionBodySchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, "Question title must be at least 5 characters")
      .max(1000, "Question title cannot exceed 1000 characters"),

    description: z.string().trim().max(5000).optional().nullable(),

    explanation: z.string().trim().max(5000).optional().nullable(),

    type: z.enum([
      QUESTION_TYPES.SINGLE_CHOICE,
      QUESTION_TYPES.MULTIPLE_CHOICE,
      QUESTION_TYPES.TRUE_FALSE,
      QUESTION_TYPES.SHORT_ANSWER,
      QUESTION_TYPES.CODING,
      QUESTION_TYPES.SQL,
      QUESTION_TYPES.PUZZLE,
    ]),

    difficulty: z.enum([
      QUESTION_DIFFICULTY.EASY,
      QUESTION_DIFFICULTY.MEDIUM,
      QUESTION_DIFFICULTY.HARD,
    ]),

    status: z
      .enum([
        QUESTION_STATUS.DRAFT,
        QUESTION_STATUS.PUBLISHED,
        QUESTION_STATUS.ARCHIVED,
      ])
      .default(QUESTION_STATUS.DRAFT),

    marks: z
      .number()
      .int()
      .min(QUESTION_LIMITS.MIN_MARKS)
      .max(QUESTION_LIMITS.MAX_MARKS)
      .default(1),

    negativeMarks: z.number().min(0).default(0),

    estimatedTime: z
      .number()
      .int()
      .min(QUESTION_LIMITS.MIN_ESTIMATED_TIME)
      .max(QUESTION_LIMITS.MAX_ESTIMATED_TIME)
      .optional()
      .nullable(),

    shuffleOptions: z.boolean().default(true),

    categoryId: z.string().trim().min(1, "Category is required"),

    tagIds: z.array(z.string().trim()).default([]),

    options: z.array(optionSchema).optional().default([]),
  })
  .superRefine((data, ctx) => {
    validateNegativeMarks(data, ctx);
    const validCount = validateOptionCount(data, ctx);
    if (validCount) {
      validateDuplicateOptions(data, ctx);
      validateCorrectAnswers(data, ctx);
    }
  });

const createQuestionSchema = z.object({
  body: createQuestionBodySchema,
});

module.exports = {
  createQuestionSchema,
  createQuestionBodySchema,
  optionSchema,
};
