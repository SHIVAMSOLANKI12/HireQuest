const pipelineCandidates = [
  {
    id: "pipeline-candidate-1",
    hiringProcessId: "hiring-1",
    candidateId: "cand-1",
    candidate: {
      id: "cand-1",
      name: "Rahul Sharma",
      email: "rahul@example.com",
    },
    currentRoundId: "round-1",
    status: "Active",
    rounds: [
      {
        roundId: "round-1",
        status: "Completed",
        resultId: "result-1",
        decision: "Shortlisted",
      },
    ],
  },
  {
    id: "pipeline-candidate-2",
    hiringProcessId: "hiring-1",
    candidateId: "cand-2",
    candidate: {
      id: "cand-2",
      name: "Priya Patel",
      email: "priya@example.com",
    },
    currentRoundId: "round-1",
    status: "Active",
    rounds: [
      {
        roundId: "round-1",
        status: "Completed",
        resultId: "result-2",
        decision: "Shortlisted",
      },
    ],
  },
  {
    id: "pipeline-candidate-3",
    hiringProcessId: "hiring-1",
    candidateId: "cand-3",
    candidate: {
      id: "cand-3",
      name: "Aman Verma",
      email: "aman@example.com",
    },
    currentRoundId: "round-1",
    status: "Active",
    rounds: [
      {
        roundId: "round-1",
        status: "Completed",
        resultId: "result-3",
        decision: "Pending",
      },
    ],
  },
  {
    id: "pipeline-candidate-4",
    hiringProcessId: "hiring-1",
    candidateId: "cand-4",
    candidate: {
      id: "cand-4",
      name: "Neha Singh",
      email: "neha@example.com",
    },
    currentRoundId: "round-1",
    status: "Active",
    rounds: [
      {
        roundId: "round-1",
        status: "Completed",
        resultId: "result-4",
        decision: "Rejected",
      },
    ],
  },
];

const delay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getPipelineCandidates = async (hiringProcessId) => {
  await delay(500);

  const matched = pipelineCandidates.filter(
    (item) => String(item.hiringProcessId) === String(hiringProcessId)
  );

  return (matched.length > 0 ? matched : pipelineCandidates).map((item) => ({
    ...item,
    candidate: { ...item.candidate },
    rounds: item.rounds.map((round) => ({ ...round })),
  }));
};
