const { z } = require("zod");
const { QUESTION_TYPES } = require("../../question.constants");

/**
 * ==========================================================
 * Correct Answer Validation Rule
 * ==========================================================
 * Verifies correct answer counts for Single Choice, Multiple Choice, and True/False questions.
 * ==========================================================
 */
function validateCorrectAnswers(data, ctx) {
  if (!data.options || data.options.length === 0) return;

  const correctAnswers = data.options.filter((o) => o.isCorrect).length;

  if (
    data.type === QUESTION_TYPES.SINGLE_CHOICE ||
    data.type === QUESTION_TYPES.TRUE_FALSE
  ) {
    if (correctAnswers !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message:
          "Single Choice and True/False questions must have exactly one correct answer.",
      });
    }
  }

  if (data.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
    if (correctAnswers < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message:
          "Multiple Choice questions must have at least one correct answer.",
      });
    }
  }
}

module.exports = { validateCorrectAnswers };
