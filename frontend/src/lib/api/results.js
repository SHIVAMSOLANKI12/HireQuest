const results = [
  {
    id: "result-1",
    assessmentId: "ass-001",
    attemptId: "attempt-1",
    candidateId: "cand-1",
    candidate: {
      id: "cand-1",
      name: "Rahul Sharma",
      email: "rahul@example.com",
    },
    assessment: {
      id: "ass-001",
      title: "Frontend Developer Assessment",
    },
    status: "Completed",
    score: 82,
    quizScore: 78,
    gameScore: 86,
    startedAt: "2026-07-28T10:00:00.000Z",
    submittedAt: "2026-07-28T10:42:00.000Z",
    sections: [
      {
        id: "quiz-js",
        type: "quiz",
        title: "JavaScript Quiz",
        score: 80,
        correctAnswers: 8,
        totalQuestions: 10,
      },
      {
        id: "memory-game",
        type: "game",
        title: "Pattern Memory",
        score: 86,
        gameScore: 420,
        accuracy: 86,
      },
      {
        id: "quiz-react",
        type: "quiz",
        title: "React & Web Core Quiz",
        score: 76,
        correctAnswers: 7,
        totalQuestions: 9,
      },
    ],
  },
  {
    id: "result-2",
    assessmentId: "ass-001",
    attemptId: "attempt-2",
    candidateId: "cand-2",
    candidate: {
      id: "cand-2",
      name: "Priya Patel",
      email: "priya@example.com",
    },
    assessment: {
      id: "ass-001",
      title: "Frontend Developer Assessment",
    },
    status: "Completed",
    score: 91,
    quizScore: 90,
    gameScore: 92,
    startedAt: "2026-07-28T11:00:00.000Z",
    submittedAt: "2026-07-28T11:38:00.000Z",
    sections: [
      {
        id: "quiz-js",
        type: "quiz",
        title: "JavaScript Quiz",
        score: 90,
        correctAnswers: 9,
        totalQuestions: 10,
      },
      {
        id: "memory-game",
        type: "game",
        title: "Pattern Memory",
        score: 92,
        gameScore: 490,
        accuracy: 92,
      },
      {
        id: "quiz-react",
        type: "quiz",
        title: "React & Web Core Quiz",
        score: 90,
        correctAnswers: 9,
        totalQuestions: 10,
      },
    ],
  },
  {
    id: "result-3",
    assessmentId: "ass-001",
    attemptId: "attempt-3",
    candidateId: "cand-3",
    candidate: {
      id: "cand-3",
      name: "Aman Verma",
      email: "aman@example.com",
    },
    assessment: {
      id: "ass-001",
      title: "Frontend Developer Assessment",
    },
    status: "In Progress",
    score: null,
    quizScore: null,
    gameScore: null,
    startedAt: "2026-07-28T12:00:00.000Z",
    submittedAt: null,
    sections: [],
  },
  {
    id: "result-4",
    assessmentId: "ass-001",
    attemptId: null,
    candidateId: "cand-4",
    candidate: {
      id: "cand-4",
      name: "Neha Singh",
      email: "neha@example.com",
    },
    assessment: {
      id: "ass-001",
      title: "Frontend Developer Assessment",
    },
    status: "Invited",
    score: null,
    quizScore: null,
    gameScore: null,
    startedAt: null,
    submittedAt: null,
    sections: [],
  },
];

const delay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getAssessmentResults = async (assessmentId) => {
  await delay(500);

  const matched = results.filter(
    (result) => String(result.assessmentId) === String(assessmentId)
  );

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

export const getResultById = async ({ assessmentId, resultId }) => {
  await delay(500);

  const result = results.find(
    (item) =>
      String(item.id) === String(resultId) &&
      (assessmentId ? String(item.assessmentId) === String(assessmentId) : true)
  );

  if (!result) {
    throw new Error("Candidate result not found.");
  }

  if (result.status !== "Completed") {
    throw new Error("Candidate result is not available yet.");
  }

  return { ...result };
};
