const { z } = require("zod");
const {
  ASSESSMENT_STATUS,
  ASSESSMENT_TYPES,
  DIFFICULTY_LEVELS,
  ASSESSMENT_DEFAULTS,
} = require("./assessment.constants");

/**
 * ==========================================================
 * Assessment Module Zod Validation Schemas
 * ==========================================================
 * Comprehensive validation layer for Assessment endpoints:
 * - Create & Update Assessment Schemas with Business Rules
 * - Publish, Archive, Duplicate & Delete Param Schemas
 * - List Filter & Pagination Query Schemas
 * ==========================================================
 */

/**
 * Create Assessment Schema
 */
const createAssessmentSchema = z.object({
  body: z
    .object({
      title: z
        .string({ required_error: "Assessment title is required." })
        .trim()
        .min(3, "Title must be at least 3 characters long.")
        .max(120, "Title cannot exceed 120 characters."),

      description: z.string().trim().max(1000, "Description cannot exceed 1000 characters.").optional().nullable(),
      instructions: z.string().trim().max(2000, "Instructions cannot exceed 2000 characters.").optional().nullable(),

      durationMinutes: z
        .number({ required_error: "Duration is required." })
        .int("Duration must be an integer in minutes.")
        .positive("Duration must be greater than 0 minutes.")
        .max(1440, "Duration cannot exceed 24 hours (1440 minutes).")
        .default(ASSESSMENT_DEFAULTS.DURATION),

      passingScore: z
        .number({ required_error: "Passing score is required." })
        .int("Passing score must be an integer.")
        .min(0, "Passing score cannot be negative.")
        .default(ASSESSMENT_DEFAULTS.PASSING_SCORE),

      maximumScore: z
        .number()
        .int("Maximum score must be an integer.")
        .positive("Maximum score must be greater than 0.")
        .default(ASSESSMENT_DEFAULTS.MAX_SCORE),

      maxAttempts: z
        .number()
        .int("Max attempts must be an integer.")
        .min(1, "At least 1 attempt must be allowed.")
        .default(ASSESSMENT_DEFAULTS.MAX_ATTEMPTS),

      type: z
        .enum([ASSESSMENT_TYPES.TECHNICAL, ASSESSMENT_TYPES.GAMING, ASSESSMENT_TYPES.MIXED])
        .default(ASSESSMENT_TYPES.MIXED),

      difficulty: z
        .enum([DIFFICULTY_LEVELS.EASY, DIFFICULTY_LEVELS.MEDIUM, DIFFICULTY_LEVELS.HARD])
        .default(DIFFICULTY_LEVELS.MEDIUM),

      publishAt: z.string().datetime("Invalid publishAt ISO date format.").optional().nullable(),
      startsAt: z.string().datetime("Invalid startsAt ISO date format.").optional().nullable(),
      endsAt: z.string().datetime("Invalid endsAt ISO date format.").optional().nullable(),

      gameIds: z.array(z.string().trim().min(1)).optional().default([]),
      questionIds: z.array(z.string().trim().min(1)).optional().default([]),
    })
    .refine((data) => data.passingScore <= data.maximumScore, {
      message: "Passing score cannot exceed maximum score.",
      path: ["passingScore"],
    })
    .refine(
      (data) => {
        if (data.publishAt && data.startsAt) {
          return new Date(data.startsAt) >= new Date(data.publishAt);
        }
        return true;
      },
      {
        message: "Start date (startsAt) must be on or after publish date (publishAt).",
        path: ["startsAt"],
      }
    )
    .refine(
      (data) => {
        if (data.startsAt && data.endsAt) {
          return new Date(data.endsAt) > new Date(data.startsAt);
        }
        return true;
      },
      {
        message: "End date (endsAt) must be strictly after start date (startsAt).",
        path: ["endsAt"],
      }
    ),
});

/**
 * Update Assessment Schema
 */
const updateAssessmentSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "Assessment ID is required." }).min(1, "Invalid assessment ID."),
  }),
  body: z
    .object({
      title: z.string().trim().min(3, "Title must be at least 3 characters.").max(120).optional(),
      description: z.string().trim().max(1000).optional().nullable(),
      instructions: z.string().trim().max(2000).optional().nullable(),
      durationMinutes: z.number().int().positive().max(1440).optional(),
      passingScore: z.number().int().min(0).optional(),
      maximumScore: z.number().int().positive().optional(),
      maxAttempts: z.number().int().min(1).optional(),
      type: z.enum([ASSESSMENT_TYPES.TECHNICAL, ASSESSMENT_TYPES.GAMING, ASSESSMENT_TYPES.MIXED]).optional(),
      difficulty: z.enum([DIFFICULTY_LEVELS.EASY, DIFFICULTY_LEVELS.MEDIUM, DIFFICULTY_LEVELS.HARD]).optional(),
      publishAt: z.string().datetime().optional().nullable(),
      startsAt: z.string().datetime().optional().nullable(),
      endsAt: z.string().datetime().optional().nullable(),
      gameIds: z.array(z.string().trim().min(1)).optional(),
      questionIds: z.array(z.string().trim().min(1)).optional(),
    })
    .refine(
      (data) => {
        if (data.passingScore !== undefined && data.maximumScore !== undefined) {
          return data.passingScore <= data.maximumScore;
        }
        return true;
      },
      {
        message: "Passing score cannot exceed maximum score.",
        path: ["passingScore"],
      }
    )
    .refine(
      (data) => {
        if (data.startsAt && data.endsAt) {
          return new Date(data.endsAt) > new Date(data.startsAt);
        }
        return true;
      },
      {
        message: "End date (endsAt) must be strictly after start date (startsAt).",
        path: ["endsAt"],
      }
    ),
});

/**
 * Assessment ID Param Schema (GetById, Publish, Archive, Duplicate, Delete)
 */
const assessmentIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "Assessment ID is required." }).min(1, "Invalid assessment ID."),
  }),
});

/**
 * Assessment List Query Filter Schema
 */
const assessmentQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("10"),
    status: z
      .enum([ASSESSMENT_STATUS.DRAFT, ASSESSMENT_STATUS.PUBLISHED, ASSESSMENT_STATUS.ACTIVE, ASSESSMENT_STATUS.ARCHIVED])
      .optional(),
    type: z.enum([ASSESSMENT_TYPES.TECHNICAL, ASSESSMENT_TYPES.GAMING, ASSESSMENT_TYPES.MIXED]).optional(),
    difficulty: z.enum([DIFFICULTY_LEVELS.EASY, DIFFICULTY_LEVELS.MEDIUM, DIFFICULTY_LEVELS.HARD]).optional(),
    search: z.string().trim().optional(),
    sortBy: z.enum(["createdAt", "title", "durationMinutes", "passingScore"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  }),
});

module.exports = {
  createAssessmentSchema,
  updateAssessmentSchema,
  assessmentIdParamSchema,
  assessmentQuerySchema,
};
