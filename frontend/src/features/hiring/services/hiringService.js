import { getHiringProcessById } from "@/lib/api/hiringProcesses";
import { getPipelineCandidates } from "@/lib/api/hiringPipeline";

export const hiringService = {
  getProcess: async (hiringProcessId) => {
    return getHiringProcessById(hiringProcessId);
  },

  getCandidates: async (hiringProcessId) => {
    return getPipelineCandidates(hiringProcessId);
  },
};
