/**
 * ==========================================================
 * Question Select Definitions
 * ==========================================================
 * Standardized Prisma selection objects for Question queries.
 * ==========================================================
 */

const QUESTION_SUMMARY_SELECT = Object.freeze({
  id: true,
  title: true,
  type: true,
  difficulty: true,
  status: true,
  marks: true,
  createdAt: true,
  updatedAt: true,
});

const QUESTION_DETAIL_SELECT = Object.freeze({
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
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  createdById: true,
  updatedById: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
  options: {
    select: {
      id: true,
      optionText: true,
      isCorrect: true,
      sequence: true,
      explanation: true,
    },
    orderBy: {
      sequence: "asc",
    },
  },
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  attachments: {
    select: {
      id: true,
      type: true,
      fileName: true,
      originalName: true,
      fileUrl: true,
    },
  },
});

module.exports = {
  QUESTION_SUMMARY_SELECT,
  QUESTION_DETAIL_SELECT,
};
