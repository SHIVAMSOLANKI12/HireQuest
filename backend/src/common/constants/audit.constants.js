/**
 * ==========================================================
 * Audit Log Constants
 * ==========================================================
 * Standardized audit actions and module enums for audit logging.
 * ==========================================================
 */

const AUDIT_ACTIONS = Object.freeze({
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  PUBLISH: "PUBLISH",
  UNPUBLISH: "UNPUBLISH",
  ARCHIVE: "ARCHIVE",
  DUPLICATE: "DUPLICATE",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
});

const AUDIT_MODULES = Object.freeze({
  AUTH: "AUTH",
  USER: "USER",
  ASSESSMENT: "ASSESSMENT",
  GAME: "GAME",
  QUESTION: "QUESTION",
});

module.exports = {
  AUDIT_ACTIONS,
  AUDIT_MODULES,
};
