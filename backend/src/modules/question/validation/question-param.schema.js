const { z } = require("zod");

/**
 * ==========================================================
 * Question ID Param Zod Validation Schema
 * ==========================================================
 * Standardized param validation for GET/DELETE/PUBLISH/ARCHIVE Question APIs
 * ==========================================================
 */
const questionIdParamSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: "Question ID is required." })
      .trim()
      .min(1, "Invalid Question ID."),
  }),
});

module.exports = {
  questionIdParamSchema,
};
