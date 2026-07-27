export const toAssessmentPayload = (assessment, status) => {
  return {
    title: assessment.title.trim(),

    description: assessment.description?.trim() ?? "",

    status,

    duration: Number(assessment.duration),

    passingScore: Number(assessment.passingScore),

    attemptsAllowed: Number(assessment.attemptsAllowed),

    shuffleQuestions: Boolean(assessment.shuffleQuestions),

    showResultToCandidate: Boolean(assessment.showResultToCandidate),

    gameIds: [...assessment.selectedGameIds],

    questionIds: [...assessment.selectedQuestionIds],
  };
};
