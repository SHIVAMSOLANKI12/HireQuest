/**
 * Normalizes an assessment object into a flat list of runtime sections.
 *
 * Priority:
 *  1. assessment.sections[]  — structured model (future backend shape)
 *  2. assessment.gameIds / assessment.questionIds — new in-memory model
 *  3. assessment.games / assessment.quizzes — legacy flat arrays
 */
export const buildRuntimeSections = (assessment) => {
  if (!assessment) return [];

  // 1. Already has a sections array
  if (
    Array.isArray(assessment.sections) &&
    assessment.sections.length > 0
  ) {
    return assessment.sections.map((section, index) => ({
      ...section,
      id: section.id ?? `section-${index + 1}`,
      type: section.type ?? "unknown",
      title: section.title ?? `Section ${index + 1}`,
    }));
  }

  // 2. New in-memory model: gameIds / questionIds (placeholder sections)
  const gameIds = Array.isArray(assessment.gameIds)
    ? assessment.gameIds
    : [];
  const questionIds = Array.isArray(assessment.questionIds)
    ? assessment.questionIds
    : [];

  if (gameIds.length > 0 || questionIds.length > 0) {
    const gameSections = gameIds.map((id, index) => ({
      id: String(id),
      type: "game",
      title: `Game ${index + 1}`,
    }));

    const quizSections = questionIds.map((id, index) => ({
      id: String(id),
      type: "quiz",
      title: `Quiz ${index + 1}`,
    }));

    return [...gameSections, ...quizSections];
  }

  // 3. Legacy flat arrays: games / quizzes
  const games = Array.isArray(assessment.games) ? assessment.games : [];
  const quizzes = Array.isArray(assessment.quizzes)
    ? assessment.quizzes
    : [];

  return [
    ...games.map((game, index) => ({
      ...game,
      id: game.id ?? `game-${index + 1}`,
      type: "game",
      title: game.title ?? `Game ${index + 1}`,
    })),
    ...quizzes.map((quiz, index) => ({
      ...quiz,
      id: quiz.id ?? `quiz-${index + 1}`,
      type: "quiz",
      title: quiz.title ?? `Quiz ${index + 1}`,
    })),
  ];
};
