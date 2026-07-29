const { prisma: defaultPrisma } = require("../../../config/prisma");

/**
 * ==========================================================
 * Assessment Repository (Data Access Layer)
 * ==========================================================
 * Pure Database Queries for Assessment Entity with Transaction Support.
 * Zero business logic inside repository layer.
 * ==========================================================
 */

const DEFAULT_SELECT = {
  id: true,
  title: true,
  description: true,
  instructions: true,
  type: true,
  difficulty: true,
  durationMinutes: true,
  passingScore: true,
  maximumScore: true,
  maxAttempts: true,
  publishAt: true,
  startsAt: true,
  endsAt: true,
  status: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  createdBy: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
  games: {
    select: {
      id: true,
      gameId: true,
      sequence: true,
      weight: true,
      game: {
        select: {
          id: true,
          name: true,
          code: true,
          description: true,
        },
      },
    },
    orderBy: {
      sequence: "asc",
    },
  },
  questions: {
    select: {
      id: true,
      questionId: true,
      sequence: true,
      marks: true,
      negativeMarks: true,
      question: {
        select: {
          id: true,
          title: true,
          type: true,
          options: {
            select: {
              id: true,
              optionText: true,
              sequence: true,
            },
            orderBy: {
              sequence: "asc",
            },
          },
        },
      },
    },
    orderBy: {
      sequence: "asc",
    },
  },
  _count: {
    select: {
      games: true,
      questions: true,
      candidateAssessments: true,
      invitations: true,
    },
  },
};

const resolveDbAndData = (first, second) => {
  const isFirstDb = typeof first === "object" && first !== null && (first.assessment || first.$transaction);
  const db = isFirstDb ? first : (typeof second === "object" && second !== null ? second : defaultPrisma);
  const data = isFirstDb ? second : first;
  return { db, data };
};

const resolveDbAndParam = (first, second) => {
  const isFirstDb = typeof first === "object" && first !== null && (first.assessment || first.$transaction);
  const db = isFirstDb ? first : (typeof second === "object" && second !== null ? second : defaultPrisma);
  const param = isFirstDb ? second : first;
  return { db, param };
};

/**
 * Create Assessment
 */
const createAssessment = (first, second) => {
  const { db, data } = resolveDbAndData(first, second);
  return db.assessment.create({
    data,
    select: DEFAULT_SELECT,
  });
};

/**
 * Find Assessment By ID
 */
const findAssessmentById = (first, second) => {
  const { db, param: id } = resolveDbAndParam(first, second);
  return db.assessment.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: DEFAULT_SELECT,
  });
};

/**
 * Check if Assessment Exists by ID
 */
const exists = async (first, second) => {
  const { db, param: id } = resolveDbAndParam(first, second);
  const count = await db.assessment.count({
    where: {
      id,
      deletedAt: null,
    },
  });
  return count > 0;
};

/**
 * Find Assessment By Title (Case-Insensitive)
 */
const findAssessmentByTitle = (first, second) => {
  const { db, param: title } = resolveDbAndParam(first, second);
  return db.assessment.findFirst({
    where: {
      title: {
        equals: title,
        mode: "insensitive",
      },
      deletedAt: null,
    },
    select: DEFAULT_SELECT,
  });
};

/**
 * Find Assessment By Title Excluding Current ID
 */
const findAssessmentByTitleExcludingId = (first, second, third) => {
  const isFirstDb = typeof first === "object" && first !== null && (first.assessment || first.$transaction);
  const db = isFirstDb ? first : defaultPrisma;
  const title = isFirstDb ? second : first;
  const id = isFirstDb ? third : second;

  return db.assessment.findFirst({
    where: {
      title,
      id: {
        not: id,
      },
      deletedAt: null,
    },
    select: DEFAULT_SELECT,
  });
};

/**
 * Update Assessment
 */
const updateAssessment = (first, second, third) => {
  const isFirstDb = typeof first === "object" && first !== null && (first.assessment || first.$transaction);
  const db = isFirstDb ? first : defaultPrisma;
  const id = isFirstDb ? second : first;
  const data = isFirstDb ? third : second;

  return db.assessment.update({
    where: {
      id,
    },
    data,
    select: DEFAULT_SELECT,
  });
};

/**
 * List Assessments with Pagination & Filters
 */
const listAssessments = (first, second) => {
  const { db, data: options } = resolveDbAndData(first, second);
  const { skip = 0, take = 10, where = {}, orderBy = { createdAt: "desc" } } = options || {};

  return db.assessment.findMany({
    skip,
    take,
    where: {
      ...where,
      deletedAt: null,
    },
    orderBy,
    select: DEFAULT_SELECT,
  });
};

/**
 * Count Assessments Matching Where Filters
 */
const countAssessments = (first, second) => {
  const { db, data: where } = resolveDbAndData(first, second);
  return db.assessment.count({
    where: {
      ...(where || {}),
      deletedAt: null,
    },
  });
};

/**
 * Publish Assessment
 */
const publishAssessment = (first, second, third) => {
  const isFirstDb = typeof first === "object" && first !== null && (first.assessment || first.$transaction);
  const db = isFirstDb ? first : defaultPrisma;
  const id = isFirstDb ? second : first;
  const publishAt = (isFirstDb ? third : second) || new Date();

  return db.assessment.update({
    where: {
      id,
    },
    data: {
      status: "PUBLISHED",
      publishAt,
    },
    select: DEFAULT_SELECT,
  });
};

/**
 * Archive Assessment
 */
const archiveAssessment = (first, second) => {
  const { db, param: id } = resolveDbAndParam(first, second);
  return db.assessment.update({
    where: {
      id,
    },
    data: {
      status: "ARCHIVED",
    },
    select: DEFAULT_SELECT,
  });
};

/**
 * Soft Delete Assessment
 */
const softDeleteAssessment = (first, second) => {
  const { db, param: id } = resolveDbAndParam(first, second);
  return db.assessment.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
    select: DEFAULT_SELECT,
  });
};

/**
 * Check if Assessment has Candidate Attempts
 */
const hasCandidateAttempts = async (first, second) => {
  const { db, param: assessmentId } = resolveDbAndParam(first, second);
  const count = await db.candidateAssessment.count({
    where: { assessmentId },
  });
  return count > 0;
};

/**
 * Check if Assessment has Invitations
 */
const hasInvitations = async (first, second) => {
  const { db, param: assessmentId } = resolveDbAndParam(first, second);
  const count = await db.invitation.count({
    where: { assessmentId },
  });
  return count > 0;
};

/**
 * Create Assessment Games Batch
 */
const createAssessmentGames = (first, second) => {
  const { db, data } = resolveDbAndData(first, second);
  return db.assessmentGame.createMany({
    data,
  });
};

/**
 * Create Assessment Questions Batch
 */
const createAssessmentQuestions = (first, second) => {
  const { db, data } = resolveDbAndData(first, second);
  return db.assessmentQuestion.createMany({
    data,
  });
};

module.exports = {
  DEFAULT_SELECT,
  createAssessment,
  findAssessmentById,
  exists,
  findAssessmentByTitle,
  findAssessmentByTitleExcludingId,
  updateAssessment,
  listAssessments,
  countAssessments,
  publishAssessment,
  archiveAssessment,
  softDeleteAssessment,
  hasCandidateAttempts,
  hasInvitations,
  createAssessmentGames,
  createAssessmentQuestions,
};
