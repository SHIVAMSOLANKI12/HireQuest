/**
 * ==========================================================
 * Question Snapshot Sanitizer
 * ==========================================================
 * Sanitizes Question entities for versioning and audit logging.
 * Strips circular references, sensitive fields, and metadata.
 * ==========================================================
 */

const ALLOWED_QUESTION_FIELDS = Object.freeze([
  "id",
  "title",
  "description",
  "explanation",
  "type",
  "difficulty",
  "status",
  "marks",
  "negativeMarks",
  "estimatedTime",
  "shuffleOptions",
  "version",
  "categoryId",
]);

function sanitizeQuestionSnapshot(question) {
  if (!question) return null;

  const snapshot = {};

  for (const field of ALLOWED_QUESTION_FIELDS) {
    snapshot[field] = question[field] ?? null;
  }

  snapshot.options =
    question.options?.map((option) => ({
      optionText: option.optionText,
      isCorrect: option.isCorrect,
      sequence: option.sequence,
    })) ?? [];

  snapshot.tags =
    question.tags?.map((tag) => ({
      id: tag.tag?.id ?? tag.tagId ?? tag.id,
      name: tag.tag?.name ?? tag.name ?? null,
    })) ?? [];

  return snapshot;
}

module.exports = {
  sanitizeQuestionSnapshot,
  ALLOWED_QUESTION_FIELDS,
};
