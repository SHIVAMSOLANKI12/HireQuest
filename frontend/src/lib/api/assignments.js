import { generateInvitationToken } from "@/features/candidate/utils";

let assignments = [];

const delay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getAssignments = async () => {
  await delay();

  return [...assignments];
};

export const getAssignmentByToken = async (token) => {
  await delay();

  const assignment = assignments.find(
    (item) => item.invitationToken === token
  );

  if (!assignment) {
    throw new Error("Invalid or expired invitation.");
  }

  return { ...assignment };
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
      invitationToken: null,
      invitedAt: null,
      startedAt: null,
      completedAt: null,
    };

    assignments.push(assignment);
    createdAssignments.push(assignment);
  });

  return createdAssignments;
};

export const sendInvitation = async (assignmentId) => {
  await delay(700);

  const index = assignments.findIndex(
    (assignment) => String(assignment.id) === String(assignmentId)
  );

  if (index === -1) {
    throw new Error("Assignment not found.");
  }

  const assignment = assignments[index];

  if (assignment.status === "Completed") {
    throw new Error("Completed assessment cannot be invited again.");
  }

  const invitationToken =
    assignment.invitationToken || generateInvitationToken();

  const updatedAssignment = {
    ...assignment,
    status: "Invited",
    invitationToken,
    invitedAt: new Date().toISOString(),
  };

  assignments[index] = updatedAssignment;

  return { ...updatedAssignment };
};

export const sendBulkInvitations = async (assignmentIds) => {
  const results = [];

  for (const assignmentId of assignmentIds) {
    const invitation = await sendInvitation(assignmentId);
    results.push(invitation);
  }

  return results;
};
