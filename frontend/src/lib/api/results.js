const results = [
  {
    id: "result-1",
    assessmentId: "ass-001",
    candidateId: "cand-1",
    candidate: {
      id: "cand-1",
      name: "Rahul Sharma",
      email: "rahul@example.com",
    },
    status: "Completed",
    score: 82,
    submittedAt: "2026-07-28T10:30:00.000Z",
  },
  {
    id: "result-2",
    assessmentId: "ass-001",
    candidateId: "cand-2",
    candidate: {
      id: "cand-2",
      name: "Priya Patel",
      email: "priya@example.com",
    },
    status: "Completed",
    score: 91,
    submittedAt: "2026-07-28T11:10:00.000Z",
  },
  {
    id: "result-3",
    assessmentId: "ass-001",
    candidateId: "cand-3",
    candidate: {
      id: "cand-3",
      name: "Aman Verma",
      email: "aman@example.com",
    },
    status: "In Progress",
    score: null,
    submittedAt: null,
  },
  {
    id: "result-4",
    assessmentId: "ass-001",
    candidateId: "cand-4",
    candidate: {
      id: "cand-4",
      name: "Neha Singh",
      email: "neha@example.com",
    },
    status: "Invited",
    score: null,
    submittedAt: null,
  },
];

const delay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getAssessmentResults = async (assessmentId) => {
  await delay(500);

  const matched = results.filter(
    (result) => String(result.assessmentId) === String(assessmentId)
  );

  // Fallback to all mock results if specific assessmentId doesn't match
  return matched.length > 0 ? matched : results;
};

export const getAssessmentResultSummary = async (assessmentId) => {
  await delay(400);

  const assessmentResults = await getAssessmentResults(assessmentId);

  const candidates = assessmentResults.length;
  const inProgress = assessmentResults.filter(
    (result) => result.status === "In Progress"
  ).length;
  const completed = assessmentResults.filter(
    (result) => result.status === "Completed"
  ).length;

  return {
    candidates,
    invited: candidates,
    started: inProgress + completed,
    completed,
  };
};
