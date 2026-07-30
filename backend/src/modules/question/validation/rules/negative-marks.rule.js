const { z } = require("zod");

/**
 * ==========================================================
 * Negative Marks Validation Rule
 * ==========================================================
 * Ensures negative marks penalty does not exceed total question marks.
 * ==========================================================
 */
function validateNegativeMarks(data, ctx) {
  if (data.negativeMarks > data.marks) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["negativeMarks"],
      message: "Negative marks cannot exceed total marks.",
    });
  }
}

module.exports = { validateNegativeMarks };
