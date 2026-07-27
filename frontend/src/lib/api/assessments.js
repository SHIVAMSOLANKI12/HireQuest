let assessments = [];

const delay = (ms = 500) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export const getAssessments = async () => {
  await delay();
  return [...assessments];
};

export const createAssessment = async (payload) => {
  await delay();

  const now = new Date().toISOString();

  const assessment = {
    id: Date.now(),
    ...payload,
    candidateCount: 0,
    createdAt: now,
    updatedAt: now,
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
