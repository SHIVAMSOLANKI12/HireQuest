const mainConstants = require("./tag.constants");
const { TAG_MESSAGES } = require("./tag-message.constants");
const { TAG_ERRORS } = require("./tag-error.constants");

/**
 * ==========================================================
 * Tag Constants Central Index Exporter
 * ==========================================================
 */

module.exports = {
  ...mainConstants,
  TAG_MESSAGES,
  TAG_ERRORS,
};
