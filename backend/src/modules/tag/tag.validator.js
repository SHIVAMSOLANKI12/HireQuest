const { createTagSchema } = require("./validation/create-tag.schema");
const { updateTagSchema } = require("./validation/update-tag.schema");
const { tagIdParamSchema } = require("./validation/tag-param.schema");
const { tagQuerySchema } = require("./validation/tag-query.schema");

/**
 * ==========================================================
 * Tag Validator Facade Exporter
 * ==========================================================
 */

module.exports = {
  createTagSchema,
  updateTagSchema,
  tagIdParamSchema,
  tagQuerySchema,
};
