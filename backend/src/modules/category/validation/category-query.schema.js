const { z } = require("zod");

/**
 * ==========================================================
 * Category List Query Filter Zod Validation Schema
 * ==========================================================
 * Standardized query validation for GET /question-categories
 * ==========================================================
 */
const categoryQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("10"),
    search: z.string().trim().optional(),
    sortBy: z.enum(["name", "createdAt", "updatedAt"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
    isActive: z.enum(["true", "false", "all"]).optional().default("true"),
  }),
});

module.exports = {
  categoryQuerySchema,
};
