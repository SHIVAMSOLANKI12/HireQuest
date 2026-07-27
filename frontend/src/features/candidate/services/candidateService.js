import { getCandidates } from "@/lib/api/candidates";

export const candidateService = {
  getAll: async () => {
    return getCandidates();
  },
};
