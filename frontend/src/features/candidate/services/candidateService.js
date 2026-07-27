import { createCandidate, getCandidates } from "@/lib/api/candidates";

export const candidateService = {
  getAll: async () => {
    return getCandidates();
  },

  create: async (payload) => {
    return createCandidate(payload);
  },
};
