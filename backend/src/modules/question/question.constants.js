/**
 * ==========================================================
 * Question Module Constants
 * ==========================================================
 * Standardized Enums, Messages, Errors, and Limits for Question domain.
 * ==========================================================
 */

const QUESTION_TYPES = Object.freeze({
  SINGLE_CHOICE: "SINGLE_CHOICE",
  MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
  TRUE_FALSE: "TRUE_FALSE",
  SHORT_ANSWER: "SHORT_ANSWER",
  CODING: "CODING",
  SQL: "SQL",
  PUZZLE: "PUZZLE",
});

const QUESTION_DIFFICULTY = Object.freeze({
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
});

const QUESTION_STATUS = Object.freeze({
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
});

const QUESTION_LIMITS = Object.freeze({
  MIN_OPTIONS: 2,
  MAX_OPTIONS: 8,
  MIN_MARKS: 1,
  MAX_MARKS: 100,
  MIN_ESTIMATED_TIME: 10,
  MAX_ESTIMATED_TIME: 7200,
});

const QUESTION_MESSAGES = Object.freeze({
  CREATE_SUCCESS: "Question created successfully.",
  UPDATE_SUCCESS: "Question updated successfully.",
  DELETE_SUCCESS: "Question deleted successfully.",
  PUBLISH_SUCCESS: "Question published successfully.",
  ARCHIVE_SUCCESS: "Question archived successfully.",
  QUESTION_FETCHED: "Question fetched successfully.",
  QUESTIONS_FETCHED: "Questions retrieved successfully.",
});

const QUESTION_ERRORS = Object.freeze({
  NOT_FOUND: "Question not found.",
  DUPLICATE_TITLE: "A question with this title already exists.",
  INVALID_SINGLE_CHOICE: "Single choice questions must have exactly 1 correct option.",
  INVALID_MULTIPLE_CHOICE: "Multiple choice questions must have at least 1 correct option.",
  MIN_OPTIONS_REQUIRED: "Objective questions must have at least 2 options.",
  MAX_OPTIONS_EXCEEDED: "Objective questions cannot exceed 8 options.",
  CATEGORY_NOT_FOUND: "Selected category does not exist or is inactive.",
  TAGS_NOT_FOUND: "One or more selected tags do not exist or are inactive.",
  CANNOT_EDIT_PUBLISHED: "Published questions cannot be edited directly.",
  ALREADY_ARCHIVED: "Question is already archived.",
});

module.exports = Object.freeze({
  QUESTION_TYPES,
  QUESTION_DIFFICULTY,
  QUESTION_STATUS,
  QUESTION_LIMITS,
  QUESTION_MESSAGES,
  QUESTION_ERRORS,
});
