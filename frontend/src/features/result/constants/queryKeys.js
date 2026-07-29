export const RESULT_QUERY_KEYS = {
  all: ["results"],

  assessment: (assessmentId) => [
    "results",
    "assessment",
    String(assessmentId),
  ],

  summary: (assessmentId) => [
    "results",
    "assessment",
    String(assessmentId),
    "summary",
  ],
};
