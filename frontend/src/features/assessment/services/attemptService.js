import {
  getAttemptByAssignmentId,
  getAttemptById,
  getAttempts,
  saveGameResult,
  saveQuizResponse,
  startAttempt,
  updateAttemptProgress,
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

  updateProgress: async ({ attemptId, currentSection }) => {
    return updateAttemptProgress({ attemptId, currentSection });
  },

  saveQuizResponse: async ({ attemptId, sectionId, questionId, optionId }) => {
    return saveQuizResponse({
      attemptId,
      sectionId,
      questionId,
      optionId,
    });
  },

  saveGameResult: async ({ attemptId, sectionId, result }) => {
    return saveGameResult({
      attemptId,
      sectionId,
      result,
    });
  },
};
