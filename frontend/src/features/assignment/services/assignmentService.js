import { getAssignmentByToken } from "@/lib/api/assignments";

export const assignmentService = {
  getByToken: async (token) => {
    return getAssignmentByToken(token);
  },
};
