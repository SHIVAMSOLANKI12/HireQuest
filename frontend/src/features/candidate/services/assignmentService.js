import { assignAssessment, getAssignments } from "@/lib/api/assignments";

export const assignmentService = {
  getAll: async () => {
    return getAssignments();
  },

  assign: async ({ assessmentId, candidateIds }) => {
    return assignAssessment({
      assessmentId,
      candidateIds,
    });
  },
};
