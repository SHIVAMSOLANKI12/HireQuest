import {
  startAssessmentWorkflow,
  submitAssessmentWorkflow,
} from "@/lib/api/assessmentWorkflow";
import {
  getAttemptByAssignmentId,
  saveQuizResponse,
} from "@/lib/api/attempts";

export const attemptService = {
  start: async (token) => startAssessmentWorkflow(token),

  getByAssignment: async (assignmentId) =>
    getAttemptByAssignmentId(assignmentId),

  saveResponse: async (payload) => saveQuizResponse(payload),

  submit: async (payload) => submitAssessmentWorkflow(payload),
};
