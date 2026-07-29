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
    score: null,
  };

  attempts.push(attempt);

  return { ...attempt };
};
