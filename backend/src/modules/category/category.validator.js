const { createCategorySchema } = require("./validation/create-category.schema");
const { updateCategorySchema } = require("./validation/update-category.schema");
const { categoryIdParamSchema } = require("./validation/category-param.schema");
const { categoryQuerySchema } = require("./validation/category-query.schema");

/**
 * ==========================================================
 * Category Validator Facade Exporter
 * ==========================================================
 */

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
  categoryQuerySchema,
};
