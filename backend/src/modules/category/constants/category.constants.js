/**
 * ==========================================================
 * Category Module Main Constants
 * ==========================================================
 * Centralized constants for Category domain limit rules,
 * pagination defaults, sorting options, and search fields.
 * ==========================================================
 */

const CATEGORY_STATUS = Object.freeze({
  ACTIVE: true,
  INACTIVE: false,
});

const CATEGORY_LIMITS = Object.freeze({
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 5,
  MAX_DESCRIPTION_LENGTH: 500,
});

const CATEGORY_SORT_FIELDS = Object.freeze({
  NAME: "name",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
});

const CATEGORY_SORT_ORDER = Object.freeze({
  ASC: "asc",
  DESC: "desc",
});

const DEFAULT_CATEGORY_PAGINATION = Object.freeze({
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
});

const CATEGORY_SEARCH_FIELDS = Object.freeze(["name", "description"]);

module.exports = {
  CATEGORY_STATUS,
  CATEGORY_LIMITS,
  CATEGORY_SORT_FIELDS,
  CATEGORY_SORT_ORDER,
  DEFAULT_CATEGORY_PAGINATION,
  CATEGORY_SEARCH_FIELDS,
};
