const { z } = require("zod");

/**
 * ==========================================================
 * Tag ID Param Zod Validation Schema
 * ==========================================================
 * Standardized param validation for GET/DELETE/RESTORE Tag APIs
 * ==========================================================
 */
const tagIdParamSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: "Tag ID is required." })
      .trim()
      .min(1, "Invalid Tag ID."),
  }),
});

module.exports = {
  tagIdParamSchema,
};
