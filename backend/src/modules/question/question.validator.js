const { z } = require("zod");
const {
  QUESTION_TYPES,
  QUESTION_DIFFICULTY,
  QUESTION_STATUS,
  QUESTION_LIMITS,
} = require("./question.constants");

/**
 * ==========================================================
 * Option Schema Validation
 * ==========================================================
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
 * ==========================================================
 * Create Question Zod Validation Schema
 * ==========================================================
 */
const createQuestionSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, "Question title must be at least 5 characters")
      .max(1000, "Question title cannot exceed 1000 characters"),

    description: z
      .string()
      .trim()
      .max(5000)
      .optional()
      .nullable(),

    explanation: z
      .string()
      .trim()
      .max(5000)
      .optional()
      .nullable(),

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
      .max(QUESTION_LIMITS.MAX_MARKS),

    negativeMarks: z
      .number()
      .min(0)
      .default(0),

    estimatedTime: z
      .number()
      .int()
      .min(QUESTION_LIMITS.MIN_ESTIMATED_TIME)
      .max(QUESTION_LIMITS.MAX_ESTIMATED_TIME)
      .optional()
      .nullable(),

    shuffleOptions: z.boolean().default(true),

    categoryId: z
      .string()
      .trim()
      .min(1, "Category is required"),

    tagIds: z
      .array(z.string().trim())
      .default([]),

    options: z
      .array(optionSchema)
      .optional()
      .default([]),
  })

  .superRefine((data, ctx) => {
    /**
     * Negative Marks Validation
     */
    if (data.negativeMarks > data.marks) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["negativeMarks"],
        message: "Negative marks cannot exceed total marks",
      });
    }

    /**
     * Objective Question Type Options Validation
     */
    const isObjective = [
      QUESTION_TYPES.SINGLE_CHOICE,
      QUESTION_TYPES.MULTIPLE_CHOICE,
      QUESTION_TYPES.TRUE_FALSE,
    ].includes(data.type);

    if (isObjective) {
      if (!data.options || data.options.length < QUESTION_LIMITS.MIN_OPTIONS) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: `Objective questions require at least ${QUESTION_LIMITS.MIN_OPTIONS} options`,
        });
        return;
      }

      if (data.options.length > QUESTION_LIMITS.MAX_OPTIONS) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: `Objective questions cannot exceed ${QUESTION_LIMITS.MAX_OPTIONS} options`,
        });
        return;
      }

      /**
       * Duplicate Sequence Validation
       */
      const sequences = data.options.map((o) => o.sequence);
      if (new Set(sequences).size !== sequences.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Duplicate option sequence found",
        });
      }

      /**
       * Duplicate Option Text Validation
       */
      const optionTexts = data.options.map((o) =>
        o.optionText.trim().toLowerCase()
      );
      if (new Set(optionTexts).size !== optionTexts.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Duplicate option text is not allowed",
        });
      }

      /**
       * Correct Answer Count Validation
       */
      const correctAnswers = data.options.filter(
        (option) => option.isCorrect
      ).length;

      if (
        data.type === QUESTION_TYPES.SINGLE_CHOICE ||
        data.type === QUESTION_TYPES.TRUE_FALSE
      ) {
        if (correctAnswers !== 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["options"],
            message:
              "Single Choice and True/False questions must have exactly one correct answer",
          });
        }
      }

      if (data.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
        if (correctAnswers < 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["options"],
            message:
              "Multiple Choice questions must have at least one correct answer",
          });
        }
      }
    }
  });

module.exports = {
  createQuestionSchema,
  optionSchema,
};
