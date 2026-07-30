/**
 * ==========================================================
 * Category Select Definitions
 * ==========================================================
 * Standardized Prisma selection objects for Category queries.
 * ==========================================================
 */

const CATEGORY_DEFAULT_SELECT = Object.freeze({
  id: true,
  name: true,
  description: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
});

const CATEGORY_WITH_COUNT_SELECT = Object.freeze({
  id: true,
  name: true,
  description: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      questions: true,
    },
  },
});

module.exports = {
  CATEGORY_DEFAULT_SELECT,
  CATEGORY_WITH_COUNT_SELECT,
};
