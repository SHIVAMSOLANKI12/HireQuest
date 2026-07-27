import {
  createAssessment,
  getAssessmentById,
  getAssessments,
} from "@/lib/api/assessments";

export const assessmentService = {
  getAll: async () => {
    return getAssessments();
  },

  getById: async (id) => {
    return getAssessmentById(id);
  },

  create: async (payload) => {
    return createAssessment(payload);
  },
};
