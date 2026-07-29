import {
  getAttemptByAssignmentId,
  getAttemptById,
  getAttempts,
  startAttempt,
} from "@/lib/api/attempts";

import { markAssignmentInProgress } from "@/lib/api/assignments";

export const attemptService = {
  getAll: async () => {
    return getAttempts();
  },

  getById: async (attemptId) => {
    return getAttemptById(attemptId);
  },

  getByAssignmentId: async (assignmentId) => {
    return getAttemptByAssignmentId(assignmentId);
  },

  start: async ({ assignmentId, candidateId, assessmentId }) => {
    const attempt = await startAttempt({
      assignmentId,
      candidateId,
      assessmentId,
    });

    await markAssignmentInProgress(assignmentId);

    return attempt;
  },
};
