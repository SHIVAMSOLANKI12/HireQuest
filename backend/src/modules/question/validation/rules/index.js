const { validateNegativeMarks } = require("./negative-marks.rule");
const { validateOptionCount } = require("./option-count.rule");
const { validateDuplicateOptions } = require("./duplicate-options.rule");
const { validateCorrectAnswers } = require("./correct-answer.rule");

/**
 * ==========================================================
 * Question Business Validation Rules Exporter
 * ==========================================================
 */

module.exports = {
  validateNegativeMarks,
  validateOptionCount,
  validateDuplicateOptions,
  validateCorrectAnswers,
};
