const { z } = require("zod");
const { TAG_LIMITS } = require("../constants/tag.constants");

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
 * Create Tag Zod Validation Schema
 * ==========================================================
 * Validates Tag creation payloads with whitespace normalization,
 * empty string cleanup, bounds checking, and strict key validation.
 * ==========================================================
 */
const createTagSchema = z
  .object({
    name: z.preprocess(
      normalizeString,
      z
        .string({
          required_error: "Tag name is required.",
          invalid_type_error: "Tag name must be a string.",
        })
        .min(
          TAG_LIMITS.MIN_NAME_LENGTH,
          `Tag name must be at least ${TAG_LIMITS.MIN_NAME_LENGTH} characters.`
        )
        .max(
          TAG_LIMITS.MAX_NAME_LENGTH,
          `Tag name cannot exceed ${TAG_LIMITS.MAX_NAME_LENGTH} characters.`
        )
    ),

    description: z.preprocess(
      normalizeOptionalString,
      z
        .string({
          invalid_type_error: "Description must be a string.",
        })
        .min(
          TAG_LIMITS.MIN_DESCRIPTION_LENGTH,
          `Description must be at least ${TAG_LIMITS.MIN_DESCRIPTION_LENGTH} characters.`
        )
        .max(
          TAG_LIMITS.MAX_DESCRIPTION_LENGTH,
          `Description cannot exceed ${TAG_LIMITS.MAX_DESCRIPTION_LENGTH} characters.`
        )
        .optional()
    ),
  })
  .strict();

module.exports = {
  createTagSchema,
};
