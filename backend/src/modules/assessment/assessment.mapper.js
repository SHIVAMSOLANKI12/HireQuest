/**
 * ======================================================
 * Assessment Response Mapper
 * ======================================================
 * Transforms raw Prisma Assessment entities into clean, sanitized
 * client DTOs for detail, summary, list, and paginated responses.
 * ======================================================
 */

/**
 * Single Assessment Full Detail Response
 */
const toAssessmentResponse = (assessment) => {
  if (!assessment) return null;

  return {
    id: assessment.id,
    title: assessment.title,
    description: assessment.description || null,
    instructions: assessment.instructions || null,
    type: assessment.type,
    difficulty: assessment.difficulty,
    durationMinutes: assessment.durationMinutes,
    passingScore: assessment.passingScore,
    maximumScore: assessment.maximumScore,
    maxAttempts: assessment.maxAttempts,
    publishAt: assessment.publishAt || null,
    startsAt: assessment.startsAt || null,
    endsAt: assessment.endsAt || null,
    status: assessment.status,
    createdById: assessment.createdById,
    createdBy: assessment.createdBy
      ? {
          id: assessment.createdBy.id,
          firstName: assessment.createdBy.firstName,
          lastName: assessment.createdBy.lastName,
          email: assessment.createdBy.email,
        }
      : null,
    gamesCount: Array.isArray(assessment.games) ? assessment.games.length : (assessment._count?.games || 0),
    questionsCount: Array.isArray(assessment.questions) ? assessment.questions.length : (assessment._count?.questions || 0),
    createdAt: assessment.createdAt,
    updatedAt: assessment.updatedAt,
  };
};

/**
 * Assessment Summary Response
 */
const toAssessmentSummary = (assessment) => {
  if (!assessment) return null;

  return {
    id: assessment.id,
    title: assessment.title,
    type: assessment.type,
    difficulty: assessment.difficulty,
    durationMinutes: assessment.durationMinutes,
    passingScore: assessment.passingScore,
    maximumScore: assessment.maximumScore,
    status: assessment.status,
    createdAt: assessment.createdAt,
  };
};

/**
 * Assessment List Mapper
 */
const toAssessmentListResponse = (assessments = []) => {
  return assessments.map(toAssessmentSummary);
};

/**
 * Paginated Assessment Response
 */
const toPaginatedAssessmentResponse = ({ data = [], total = 0, page = 1, limit = 10 }) => {
  const currentPage = Number(page) || 1;
  const pageLimit = Number(limit) || 10;
  const totalPages = Math.ceil(total / pageLimit) || 1;

  return {
    items: toAssessmentListResponse(data),
    pagination: {
      total,
      page: currentPage,
      limit: pageLimit,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
};

module.exports = {
  toAssessmentResponse,
  toAssessmentSummary,
  toAssessmentListResponse,
  toPaginatedAssessmentResponse,
};
