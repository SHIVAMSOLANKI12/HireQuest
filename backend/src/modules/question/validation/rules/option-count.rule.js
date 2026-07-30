const { z } = require("zod");
const { QUESTION_TYPES, QUESTION_LIMITS } = require("../../question.constants");

/**
 * ==========================================================
 * Option Count Validation Rule
 * ==========================================================
 * Verifies option count bounds for objective vs subject/coding types.
 * ==========================================================
 */
function validateOptionCount(data, ctx) {
  const isObjective = [
    QUESTION_TYPES.SINGLE_CHOICE,
    QUESTION_TYPES.MULTIPLE_CHOICE,
    QUESTION_TYPES.TRUE_FALSE,
  ].includes(data.type);

  if (isObjective) {
    if (!data.options || data.options.length < QUESTION_LIMITS.MIN_OPTIONS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: `Objective questions require at least ${QUESTION_LIMITS.MIN_OPTIONS} options.`,
      });
      return false;
    }

    if (data.options.length > QUESTION_LIMITS.MAX_OPTIONS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: `Objective questions cannot exceed ${QUESTION_LIMITS.MAX_OPTIONS} options.`,
      });
      return false;
    }
  } else {
    if (data.options && data.options.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: `Question type '${data.type}' does not accept options.`,
      });
      return false;
    }
  }

  return true;
}

module.exports = { validateOptionCount };
