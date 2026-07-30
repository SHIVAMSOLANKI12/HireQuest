const mainConstants = require("./category.constants");
const { CATEGORY_MESSAGES } = require("./category-message.constants");
const { CATEGORY_ERRORS } = require("./category-error.constants");

/**
 * ==========================================================
 * Category Constants Central Index Exporter
 * ==========================================================
 */

module.exports = {
  ...mainConstants,
  CATEGORY_MESSAGES,
  CATEGORY_ERRORS,
};
