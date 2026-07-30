const { z } = require("zod");
const { CATEGORY_LIMITS } = require("../constants/category.constants");

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : value;

const normalizeOptionalString = (value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

/**
 * ==========================================================
 * Update Category Zod Validation Schema
 * ==========================================================
 * Standardized params & body validation for PATCH /question-categories/:id
 * ==========================================================
 */
const updateCategorySchema = z.object({
  params: z.object({
    id: z.string({ required_error: "Category ID is required." }).trim().min(1, "Invalid Category ID."),
  }),
  body: z
    .object({
      name: z
        .preprocess(
          normalizeString,
          z
            .string()
            .min(
              CATEGORY_LIMITS.MIN_NAME_LENGTH,
              `Category name must be at least ${CATEGORY_LIMITS.MIN_NAME_LENGTH} characters.`
            )
            .max(
              CATEGORY_LIMITS.MAX_NAME_LENGTH,
              `Category name cannot exceed ${CATEGORY_LIMITS.MAX_NAME_LENGTH} characters.`
            )
        )
        .optional(),

      description: z
        .preprocess(
          normalizeOptionalString,
          z
            .string()
            .min(
              CATEGORY_LIMITS.MIN_DESCRIPTION_LENGTH,
              `Description must be at least ${CATEGORY_LIMITS.MIN_DESCRIPTION_LENGTH} characters.`
            )
            .max(
              CATEGORY_LIMITS.MAX_DESCRIPTION_LENGTH,
              `Description cannot exceed ${CATEGORY_LIMITS.MAX_DESCRIPTION_LENGTH} characters.`
            )
            .nullable()
        )
        .optional(),

      isActive: z.boolean().optional(),
    })
    .strict(),
});

module.exports = {
  updateCategorySchema,
};
