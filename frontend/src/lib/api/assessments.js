const now = new Date().toISOString();

let assessments = [
  {
    id: "ass-001",
    title: "Frontend Developer Hiring",
    description:
      "Assessment for hiring React and Next.js frontend developers.",
    difficulty: "Medium",
    duration: 45,
    passingScore: 70,
    attemptsAllowed: 1,
    shuffleQuestions: true,
    showResultToCandidate: false,
    status: "Published",
    gameIds: [],
    questionIds: [],
    candidateCount: 120,
    createdAt: "2026-07-20T10:00:00.000Z",
    updatedAt: "2026-07-24T10:00:00.000Z",
  },
  {
    id: "ass-002",
    title: "Java Backend Assessment",
    description:
      "Assessment focused on Java, Spring Boot and SQL.",
    difficulty: "Hard",
    duration: 60,
    passingScore: 75,
    attemptsAllowed: 1,
    shuffleQuestions: false,
    showResultToCandidate: false,
    status: "Draft",
    gameIds: [],
    questionIds: [],
    candidateCount: 0,
    createdAt: "2026-07-22T10:00:00.000Z",
    updatedAt: "2026-07-24T10:00:00.000Z",
  },
  {
    id: "ass-003",
    title: "React Internship Hiring",
    description:
      "Entry level assessment for React internship candidates.",
    difficulty: "Easy",
    duration: 30,
    passingScore: 60,
    attemptsAllowed: 2,
    shuffleQuestions: true,
    showResultToCandidate: true,
    status: "Published",
    gameIds: [],
    questionIds: [],
    candidateCount: 58,
    createdAt: "2026-07-18T10:00:00.000Z",
    updatedAt: "2026-07-23T10:00:00.000Z",
  },
  {
    id: "ass-004",
    title: "Full Stack Node.js Test",
    description:
      "Comprehensive assessment for full-stack Node.js developers.",
    difficulty: "Hard",
    duration: 75,
    passingScore: 72,
    attemptsAllowed: 1,
    shuffleQuestions: true,
    showResultToCandidate: false,
    status: "Published",
    gameIds: [],
    questionIds: [],
    candidateCount: 34,
    createdAt: "2026-07-15T10:00:00.000Z",
    updatedAt: "2026-07-22T10:00:00.000Z",
  },
  {
    id: "ass-005",
    title: "UI/UX Design Aptitude",
    description:
      "Evaluates visual thinking, design fundamentals and user empathy.",
    difficulty: "Medium",
    duration: 40,
    passingScore: 65,
    attemptsAllowed: 1,
    shuffleQuestions: true,
    showResultToCandidate: true,
    status: "Draft",
    gameIds: [],
    questionIds: [],
    candidateCount: 0,
    createdAt: "2026-07-25T10:00:00.000Z",
    updatedAt: "2026-07-25T10:00:00.000Z",
  },
  {
    id: "ass-006",
    title: "Data Analyst Screening",
    description:
      "Python, SQL, statistics and data interpretation for analyst roles.",
    difficulty: "Medium",
    duration: 50,
    passingScore: 70,
    attemptsAllowed: 1,
    shuffleQuestions: false,
    showResultToCandidate: false,
    status: "Published",
    gameIds: [],
    questionIds: [],
    candidateCount: 76,
    createdAt: "2026-07-12T10:00:00.000Z",
    updatedAt: "2026-07-20T10:00:00.000Z",
  },
];

const delay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getAssessments = async () => {
  await delay();
  return [...assessments];
};

export const createAssessment = async (payload) => {
  await delay();

  const assessment = {
    id: `ass-${Date.now()}`,
    ...payload,
    candidateCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  assessments = [assessment, ...assessments];

  return assessment;
};

export const getAssessmentById = async (id) => {
  await delay();

  const assessment = assessments.find(
    (item) => String(item.id) === String(id)
  );

  if (!assessment) {
    throw new Error("Assessment not found");
  }

  return assessment;
};

export const updateAssessment = async (id, payload) => {
  await delay();

  const index = assessments.findIndex(
    (assessment) => String(assessment.id) === String(id)
  );

  if (index === -1) {
    throw new Error("Assessment not found");
  }

  const updatedAssessment = {
    ...assessments[index],
    ...payload,
    id: assessments[index].id,
    updatedAt: new Date().toISOString(),
  };

  assessments[index] = updatedAssessment;

  return updatedAssessment;
};
