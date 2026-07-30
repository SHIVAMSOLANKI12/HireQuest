/**
 * ==========================================================
 * Tag Module Main Constants
 * ==========================================================
 * Centralized constants for Tag domain limit rules,
 * pagination defaults, sorting options, and search fields.
 * ==========================================================
 */

const TAG_STATUS = Object.freeze({
  ACTIVE: true,
  INACTIVE: false,
});

const TAG_LIMITS = Object.freeze({
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_DESCRIPTION_LENGTH: 5,
  MAX_DESCRIPTION_LENGTH: 500,
});

const TAG_SORT_FIELDS = Object.freeze({
  NAME: "name",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
});

const TAG_SORT_ORDER = Object.freeze({
  ASC: "asc",
  DESC: "desc",
});

const DEFAULT_TAG_PAGINATION = Object.freeze({
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
});

const TAG_SEARCH_FIELDS = Object.freeze(["name", "description"]);

module.exports = {
  TAG_STATUS,
  TAG_LIMITS,
  TAG_SORT_FIELDS,
  TAG_SORT_ORDER,
  DEFAULT_TAG_PAGINATION,
  TAG_SEARCH_FIELDS,
};
