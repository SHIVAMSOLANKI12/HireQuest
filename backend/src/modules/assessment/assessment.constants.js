/**
 * ==========================================================
 * Assessment Module Constants
 * ==========================================================
 * Standardized Enums, Messages, Errors, and Defaults for Assessment domain.
 * ==========================================================
 */

const ASSESSMENT_STATUS = Object.freeze({
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED",
});

const DIFFICULTY_LEVELS = Object.freeze({
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
});

const ASSESSMENT_TYPES = Object.freeze({
  TECHNICAL: "TECHNICAL",
  GAMING: "GAMING",
  MIXED: "MIXED",
});

const ASSESSMENT_DEFAULTS = Object.freeze({
  PASSING_SCORE: 70,
  MAX_ATTEMPTS: 1,
  DURATION: 60,
  MAX_SCORE: 100,
});

const AUDIT_ACTIONS = Object.freeze({
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  PUBLISH: "PUBLISH",
  ARCHIVE: "ARCHIVE",
  DUPLICATE: "DUPLICATE",
});

const AUDIT_MODULES = Object.freeze({
  ASSESSMENT: "ASSESSMENT",
  AUTH: "AUTH",
});

const ASSESSMENT_MESSAGES = Object.freeze({
  CREATE_SUCCESS: "Assessment created successfully.",
  UPDATE_SUCCESS: "Assessment updated successfully.",
  DELETE_SUCCESS: "Assessment deleted successfully.",
  PUBLISH_SUCCESS: "Assessment published successfully.",
  ARCHIVE_SUCCESS: "Assessment archived successfully.",
  DUPLICATE_SUCCESS: "Assessment duplicated successfully.",
  ASSESSMENT_FETCHED: "Assessment fetched successfully.",
  ASSESSMENTS_FETCHED: "Assessments retrieved successfully.",
});

const ASSESSMENT_ERRORS = Object.freeze({
  NOT_FOUND: "Assessment not found.",
  ALREADY_PUBLISHED: "Assessment is already published.",
  ALREADY_ARCHIVED: "Assessment is already archived.",
  INVALID_STATUS: "Invalid assessment status transition.",
  DUPLICATE_TITLE: "An assessment with this title already exists.",
  MAX_ATTEMPTS_INVALID: "Max attempts must be at least 1.",
  PASSING_SCORE_INVALID: "Passing score cannot exceed maximum score.",
  CANNOT_EDIT_PUBLISHED: "Published assessments cannot be edited directly.",
});

module.exports = Object.freeze({
  ASSESSMENT_STATUS,
  DIFFICULTY_LEVELS,
  ASSESSMENT_TYPES,
  ASSESSMENT_DEFAULTS,
  AUDIT_ACTIONS,
  AUDIT_MODULES,
  ASSESSMENT_MESSAGES,
  ASSESSMENT_ERRORS,
});
