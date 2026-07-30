const { z } = require("zod");
const { CATEGORY_LIMITS } = require("../constants/category.constants");

/**
 * Normalizes string by trimming whitespace
 */
const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : value;

/**
 * Normalizes optional string: converts empty or whitespace-only strings to undefined
 */
const normalizeOptionalString = (value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

/**
 * ==========================================================
 * Create Category Zod Validation Schema
 * ==========================================================
 * Validates Category creation payloads with whitespace normalization,
 * empty string cleanup, bounds checking, and strict key validation.
 * ==========================================================
 */
const createCategorySchema = z
  .object({
    name: z.preprocess(
      normalizeString,
      z
        .string({
          required_error: "Category name is required.",
          invalid_type_error: "Category name must be a string.",
        })
        .min(
          CATEGORY_LIMITS.MIN_NAME_LENGTH,
          `Category name must be at least ${CATEGORY_LIMITS.MIN_NAME_LENGTH} characters.`
        )
        .max(
          CATEGORY_LIMITS.MAX_NAME_LENGTH,
          `Category name cannot exceed ${CATEGORY_LIMITS.MAX_NAME_LENGTH} characters.`
        )
    ),

    description: z.preprocess(
      normalizeOptionalString,
      z
        .string({
          invalid_type_error: "Description must be a string.",
        })
        .min(
          CATEGORY_LIMITS.MIN_DESCRIPTION_LENGTH,
          `Description must be at least ${CATEGORY_LIMITS.MIN_DESCRIPTION_LENGTH} characters.`
        )
        .max(
          CATEGORY_LIMITS.MAX_DESCRIPTION_LENGTH,
          `Description cannot exceed ${CATEGORY_LIMITS.MAX_DESCRIPTION_LENGTH} characters.`
        )
        .optional()
    ),
  })
  .strict();

module.exports = {
  createCategorySchema,
};
