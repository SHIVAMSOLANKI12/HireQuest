const { z } = require("zod");

/**
 * ==========================================================
 * Duplicate Options Validation Rule
 * ==========================================================
 * Ensures sequence numbers and option texts are unique per question.
 * ==========================================================
 */
function validateDuplicateOptions(data, ctx) {
  if (!data.options || data.options.length === 0) return;

  const sequences = data.options.map((o) => o.sequence);
  if (new Set(sequences).size !== sequences.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["options"],
      message: "Duplicate option sequence found.",
    });
  }

  const optionTexts = data.options.map((o) =>
    o.optionText.trim().toLowerCase()
  );
  if (new Set(optionTexts).size !== optionTexts.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["options"],
      message: "Duplicate option text is not allowed.",
    });
  }
}

module.exports = { validateDuplicateOptions };
