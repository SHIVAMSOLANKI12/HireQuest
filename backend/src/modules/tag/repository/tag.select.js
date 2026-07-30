/**
 * ==========================================================
 * Tag Select Definitions
 * ==========================================================
 * Standardized Prisma selection objects for Tag queries.
 * ==========================================================
 */

const TAG_DEFAULT_SELECT = Object.freeze({
  id: true,
  name: true,
  description: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
});

const TAG_WITH_COUNT_SELECT = Object.freeze({
  id: true,
  name: true,
  description: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      questionTags: true,
    },
  },
});

module.exports = {
  TAG_DEFAULT_SELECT,
  TAG_WITH_COUNT_SELECT,
};
