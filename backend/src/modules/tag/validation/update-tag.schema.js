const { z } = require("zod");
const { TAG_LIMITS } = require("../constants/tag.constants");

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : value;

const normalizeOptionalString = (value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

/**
 * ==========================================================
 * Update Tag Zod Validation Schema
 * ==========================================================
 * Standardized params & body validation for PATCH /question-tags/:id
 * ==========================================================
 */
const updateTagSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "Tag ID is required." }).trim().min(1, "Invalid Tag ID."),
  }),
  body: z
    .object({
      name: z
        .preprocess(
          normalizeString,
          z
            .string()
            .min(
              TAG_LIMITS.MIN_NAME_LENGTH,
              `Tag name must be at least ${TAG_LIMITS.MIN_NAME_LENGTH} characters.`
            )
            .max(
              TAG_LIMITS.MAX_NAME_LENGTH,
              `Tag name cannot exceed ${TAG_LIMITS.MAX_NAME_LENGTH} characters.`
            )
        )
        .optional(),

      description: z
        .preprocess(
          normalizeOptionalString,
          z
            .string()
            .min(
              TAG_LIMITS.MIN_DESCRIPTION_LENGTH,
              `Description must be at least ${TAG_LIMITS.MIN_DESCRIPTION_LENGTH} characters.`
            )
            .max(
              TAG_LIMITS.MAX_DESCRIPTION_LENGTH,
              `Description cannot exceed ${TAG_LIMITS.MAX_DESCRIPTION_LENGTH} characters.`
            )
            .nullable()
        )
        .optional(),

      isActive: z.boolean().optional(),
    })
    .strict(),
});

module.exports = {
  updateTagSchema,
};
