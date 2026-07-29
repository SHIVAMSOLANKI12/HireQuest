import {
  getAssessmentResults,
  getAssessmentResultSummary,
  getResultById,
} from "@/lib/api/results";

export const resultService = {
  getAssessmentResults: async (assessmentId) => {
    return getAssessmentResults(assessmentId);
  },

  getAssessmentResultSummary: async (assessmentId) => {
    return getAssessmentResultSummary(assessmentId);
  },

  getResultById: async ({ assessmentId, resultId }) => {
    return getResultById({ assessmentId, resultId });
  },
};
