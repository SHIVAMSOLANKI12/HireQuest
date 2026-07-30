/**
 * ==========================================================
 * Category Module Domain Error Codes & Messages
 * ==========================================================
 * Standardized domain error code identifiers for Category errors.
 * ==========================================================
 */

const CATEGORY_ERRORS = Object.freeze({
  ALREADY_EXISTS: "CATEGORY_ALREADY_EXISTS",
  NOT_FOUND: "CATEGORY_NOT_FOUND",
  INVALID_NAME: "CATEGORY_INVALID_NAME",
  IN_USE: "CATEGORY_IN_USE",
  ALREADY_ACTIVE: "CATEGORY_ALREADY_ACTIVE",
});

module.exports = {
  CATEGORY_ERRORS,
};
