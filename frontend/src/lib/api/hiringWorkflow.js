import { moveCandidatesToRound } from "./hiringPipeline";
import { activateNextRound } from "./hiringProcesses";

export const advanceHiringRound = async ({
  hiringProcessId,
  currentRoundId,
  nextRoundId,
  candidateIds,
}) => {
  const updatedCandidates = await moveCandidatesToRound({
    hiringProcessId,
    candidateIds,
    targetRoundId: nextRoundId,
  });

  const updatedProcess = await activateNextRound({
    hiringProcessId,
    currentRoundId,
    nextRoundId,
  });

  return {
    process: updatedProcess,
    candidates: updatedCandidates,
  };
};
