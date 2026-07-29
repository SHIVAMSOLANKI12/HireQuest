import {
  getAssessmentResults,
  getAssessmentResultSummary,
} from "@/lib/api/results";

export const resultService = {
  getAssessmentResults: async (assessmentId) => {
    return getAssessmentResults(assessmentId);
  },

  getAssessmentResultSummary: async (assessmentId) => {
    return getAssessmentResultSummary(assessmentId);
  },
};
