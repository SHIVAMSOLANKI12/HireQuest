import { calculateAssessmentScore } from "@/lib/scoring";

let attempts = [];

const delay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getAttempts = async () => {
  await delay();

  return [...attempts];
};

export const getAttemptById = async (attemptId) => {
  await delay();

  const attempt = attempts.find(
    (attempt) => String(attempt.id) === String(attemptId)
  );

  if (!attempt) {
    throw new Error("Assessment attempt not found.");
  }

  return { ...attempt };
};

export const getAttemptByAssignmentId = async (assignmentId) => {
  await delay();

  const attempt = attempts.find(
    (attempt) =>
      String(attempt.assignmentId) === String(assignmentId)
  );

  return attempt ? { ...attempt } : null;
};

export const startAttempt = async ({
  assignmentId,
  candidateId,
  assessmentId,
}) => {
  await delay(700);

  // Idempotent — prevent duplicate attempts
  const existingAttempt = attempts.find(
    (attempt) =>
      String(attempt.assignmentId) === String(assignmentId)
  );

  if (existingAttempt) {
    return { ...existingAttempt };
  }

  const attempt = {
    id: crypto.randomUUID(),

    assignmentId,
    candidateId,
    assessmentId,

    status: "In Progress",

    startedAt: new Date().toISOString(),
    submittedAt: null,

    currentSection: 0,
    responses: {},
    gameResults: {},
    score: null,
  };

  attempts.push(attempt);

  return { ...attempt };
};

export const updateAttemptProgress = async ({
  attemptId,
  currentSection,
}) => {
  await delay(300);

  const index = attempts.findIndex(
    (attempt) => String(attempt.id) === String(attemptId)
  );

  if (index === -1) {
    throw new Error("Assessment attempt not found.");
  }

  if (attempts[index].status !== "In Progress") {
    throw new Error("This attempt is not active.");
  }

  attempts[index] = {
    ...attempts[index],
    currentSection,
  };

  return { ...attempts[index] };
};

export const saveQuizResponse = async ({
  attemptId,
  sectionId,
  questionId,
  optionId,
}) => {
  await delay(300);

  const index = attempts.findIndex(
    (attempt) => String(attempt.id) === String(attemptId)
  );

  if (index === -1) {
    throw new Error("Assessment attempt not found.");
  }

  const attempt = attempts[index];

  if (attempt.status !== "In Progress") {
    throw new Error("This assessment attempt is not active.");
  }

  const currentResponses = attempt.responses ?? {};
  const sectionResponses = currentResponses[sectionId] ?? {};

  attempts[index] = {
    ...attempt,
    responses: {
      ...currentResponses,
      [sectionId]: {
        ...sectionResponses,
        [questionId]: optionId,
      },
    },
  };

  return { ...attempts[index] };
};

export const saveGameResult = async ({
  attemptId,
  sectionId,
  result,
}) => {
  await delay(400);

  const index = attempts.findIndex(
    (attempt) => String(attempt.id) === String(attemptId)
  );

  if (index === -1) {
    throw new Error("Assessment attempt not found.");
  }

  const attempt = attempts[index];

  if (attempt.status !== "In Progress") {
    throw new Error("This assessment attempt is not active.");
  }

  const currentGameResults = attempt.gameResults ?? {};

  attempts[index] = {
    ...attempt,
    gameResults: {
      ...currentGameResults,
      [sectionId]: {
        ...result,
        completedAt: new Date().toISOString(),
      },
    },
  };

  return { ...attempts[index] };
};

const isAttemptComplete = ({ assessment, attempt }) => {
  const sections =
    assessment?.sections ?? [
      ...(assessment?.games ?? []),
      ...(assessment?.quizzes ?? []),
    ];

  // Fallback: if empty arrays, check if default sample sections are used
  if (sections.length === 0) {
    // If no sections in object, return true if attempt has responses or gameResults
    const hasAnyResponse =
      Object.keys(attempt?.responses ?? {}).length > 0 ||
      Object.keys(attempt?.gameResults ?? {}).length > 0;
    return hasAnyResponse;
  }

  return sections.every((section) => {
    if (section.type === "quiz") {
      const questions = section.questions ?? [];
      if (questions.length === 0) return true;

      const responses = attempt?.responses?.[section.id] ?? {};
      return questions.every((q) => responses[q.id] != null);
    }

    if (section.type === "game") {
      return Boolean(attempt?.gameResults?.[section.id]);
    }

    return false;
  });
};

export const submitAttempt = async ({ attemptId, assessment }) => {
  await delay(700);

  const index = attempts.findIndex(
    (attempt) => String(attempt.id) === String(attemptId)
  );

  if (index === -1) {
    throw new Error("Assessment attempt not found.");
  }

  const attempt = attempts[index];

  if (attempt.status === "Completed") {
    return { ...attempt };
  }

  if (attempt.status !== "In Progress") {
    throw new Error("This assessment cannot be submitted.");
  }

  if (!isAttemptComplete({ assessment, attempt })) {
    throw new Error("Complete all required sections before submitting.");
  }

  const scoringResult = calculateAssessmentScore({ assessment, attempt });

  attempts[index] = {
    ...attempt,
    status: "Completed",
    score: scoringResult.score,
    quizScore: scoringResult.quizScore,
    gameScore: scoringResult.gameScore,
    sectionScores: scoringResult.sections,
    submittedAt: new Date().toISOString(),
  };

  return { ...attempts[index] };
};

