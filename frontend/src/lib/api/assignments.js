let assignments = [];

const delay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getAssignments = async () => {
  await delay();

  return [...assignments];
};

export const assignAssessment = async ({ assessmentId, candidateIds }) => {
  await delay(700);

  if (!assessmentId) {
    throw new Error("Assessment is required.");
  }

  if (!candidateIds || candidateIds.length === 0) {
    throw new Error("Select at least one candidate.");
  }

  const now = new Date().toISOString();
  const createdAssignments = [];

  candidateIds.forEach((candidateId, index) => {
    const alreadyAssigned = assignments.some(
      (assignment) =>
        String(assignment.candidateId) === String(candidateId) &&
        String(assignment.assessmentId) === String(assessmentId)
    );

    if (alreadyAssigned) {
      return;
    }

    const assignment = {
      id: Date.now() + index,
      candidateId,
      assessmentId,
      status: "Assigned",
      assignedAt: now,
      invitedAt: null,
      completedAt: null,
    };

    assignments.push(assignment);
    createdAssignments.push(assignment);
  });

  return createdAssignments;
};
