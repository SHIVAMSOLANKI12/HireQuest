/**
 * ==========================================================
 * Question Category Module Constants
 * ==========================================================
 * Standardized Messages, Errors, and Limits for Question Category domain.
 * ==========================================================
 */

const CATEGORY_LIMITS = Object.freeze({
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
});

const CATEGORY_MESSAGES = Object.freeze({
  CREATE_SUCCESS: "Category created successfully.",
  UPDATE_SUCCESS: "Category updated successfully.",
  DELETE_SUCCESS: "Category deleted successfully.",
  RESTORE_SUCCESS: "Category restored successfully.",
  CATEGORY_FETCHED: "Category fetched successfully.",
  CATEGORIES_FETCHED: "Categories retrieved successfully.",
});

const CATEGORY_ERRORS = Object.freeze({
  NOT_FOUND: "Question category not found.",
  DUPLICATE_NAME: "A question category with this name already exists.",
  ALREADY_DELETED: "Category is already deleted.",
  NOT_DELETED: "Category is not deleted.",
  HAS_ASSOCIATED_QUESTIONS: "Cannot delete category as it is currently associated with active questions.",
});

module.exports = Object.freeze({
  CATEGORY_LIMITS,
  CATEGORY_MESSAGES,
  CATEGORY_ERRORS,
});
