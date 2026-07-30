const { z } = require("zod");

/**
 * ==========================================================
 * Category ID Param Zod Validation Schema
 * ==========================================================
 * Standardized param validation for GET/DELETE/RESTORE Category APIs
 * ==========================================================
 */
const categoryIdParamSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: "Category ID is required." })
      .trim()
      .min(1, "Invalid Category ID."),
  }),
});

module.exports = {
  categoryIdParamSchema,
};
