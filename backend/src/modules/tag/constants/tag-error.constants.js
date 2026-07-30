/**
 * ==========================================================
 * Tag Module Domain Error Codes & Messages
 * ==========================================================
 * Standardized domain error code identifiers for Tag errors.
 * ==========================================================
 */

const TAG_ERRORS = Object.freeze({
  ALREADY_EXISTS: "TAG_ALREADY_EXISTS",
  NOT_FOUND: "TAG_NOT_FOUND",
  INVALID_NAME: "TAG_INVALID_NAME",
  IN_USE: "TAG_IN_USE",
  ALREADY_ACTIVE: "TAG_ALREADY_ACTIVE",
});

module.exports = {
  TAG_ERRORS,
};
