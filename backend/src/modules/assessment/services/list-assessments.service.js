const ApiError = require("../../../utils/ApiError");
const logger = require("../../../config/logger");
const assessmentRepository = require("../repositories/assessment.repository");
const { toPaginatedAssessmentResponse } = require("../assessment.mapper");
const { ASSESSMENT_MESSAGES } = require("../assessment.constants");

/**
 * ==========================================================
 * List Assessments Service
 * ==========================================================
 * Supports Pagination, Multi-field Filtering, Global Search, and Sorting.
 * ==========================================================
 */

/**
 * Build Where Clause with Search and Filtering Support
 */
const buildWhereClause = (query = {}) => {
  const where = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.type) {
    where.type = query.type;
  }

  if (query.difficulty) {
    where.difficulty = query.difficulty;
  }

  if (query.createdById) {
    where.createdById = query.createdById;
  }

  if (query.search) {
    where.OR = [
      {
        title: {
          contains: query.search.trim(),
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: query.search.trim(),
          mode: "insensitive",
        },
      },
    ];
  }

  return where;
};

/**
 * Get Pagination Values
 */
const getPagination = (query = {}) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

/**
 * Get Order By Clause
 */
const getOrderBy = (query = {}) => {
  const allowedFields = ["createdAt", "updatedAt", "title", "durationMinutes", "passingScore"];

  const sortBy = allowedFields.includes(query.sortBy) ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  return {
    [sortBy]: sortOrder,
  };
};

/**
 * Main List Assessments Logic
 */
const listAssessments = async ({ query = {} }) => {
  logger.info({ query }, "Listing assessments with filters");

  const { page, limit, skip } = getPagination(query);
  const where = buildWhereClause(query);
  const orderBy = getOrderBy(query);

  const [assessments, total] = await Promise.all([
    assessmentRepository.listAssessments({
      skip,
      take: limit,
      where,
      orderBy,
    }),
    assessmentRepository.countAssessments(where),
  ]);

  return {
    message: ASSESSMENT_MESSAGES.ASSESSMENTS_FETCHED,
    data: toPaginatedAssessmentResponse({
      data: assessments,
      total,
      page,
      limit,
    }),
  };
};

/**
 * Service Wrapper
 */
const listAssessmentsService = async (params = {}) => {
  try {
    const query = params.query ? params.query : params;
    return await listAssessments({ query });
  } catch (error) {
    if (error instanceof ApiError) {
      logger.warn({ error: error.message }, "List assessments query failed");
      throw error;
    }
    logger.error({ error: error.message, stack: error.stack }, "Unexpected error listing assessments");
    throw new ApiError(500, "Failed to retrieve assessments.");
  }
};

module.exports = listAssessmentsService;
