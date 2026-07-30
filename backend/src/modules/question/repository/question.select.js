/**
 * ==========================================================
 * Question Select Definitions
 * ==========================================================
 * Standardized Prisma selection objects for Question queries.
 * ==========================================================
 */

const QUESTION_OPTION_SELECT = Object.freeze({
  id: true,
  optionText: true,
  isCorrect: true,
  sequence: true,
  explanation: true,
});

const QUESTION_CATEGORY_SELECT = Object.freeze({
  id: true,
  name: true,
});

const QUESTION_TAG_SELECT = Object.freeze({
  tag: {
    select: {
      id: true,
      name: true,
    },
  },
});

const QUESTION_DEFAULT_SELECT = Object.freeze({
  id: true,
  title: true,
  description: true,
  explanation: true,
  type: true,
  difficulty: true,
  status: true,
  marks: true,
  negativeMarks: true,
  estimatedTime: true,
  shuffleOptions: true,
  version: true,
  isActive: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  createdById: true,
  updatedById: true,
  categoryId: true,
  category: {
    select: QUESTION_CATEGORY_SELECT,
  },
  options: {
    select: QUESTION_OPTION_SELECT,
    orderBy: {
      sequence: "asc",
    },
  },
  tags: {
    select: QUESTION_TAG_SELECT,
  },
});

const QUESTION_LIST_SELECT = Object.freeze({
  id: true,
  title: true,
  type: true,
  difficulty: true,
  status: true,
  marks: true,
  negativeMarks: true,
  estimatedTime: true,
  version: true,
  isActive: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  categoryId: true,
  category: {
    select: QUESTION_CATEGORY_SELECT,
  },
  tags: {
    select: QUESTION_TAG_SELECT,
  },
  _count: {
    select: {
      options: true,
      assessments: true,
    },
  },
});

module.exports = {
  QUESTION_OPTION_SELECT,
  QUESTION_CATEGORY_SELECT,
  QUESTION_TAG_SELECT,
  QUESTION_DEFAULT_SELECT,
  QUESTION_LIST_SELECT,
};
