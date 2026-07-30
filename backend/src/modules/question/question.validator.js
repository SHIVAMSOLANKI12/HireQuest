const {
  createQuestionSchema,
  createQuestionBodySchema,
  optionSchema,
} = require("./validation/create-question.schema");
const {
  updateQuestionSchema,
  updateQuestionBodySchema,
} = require("./validation/update-question.schema");
const { questionIdParamSchema } = require("./validation/question-param.schema");
const { questionQuerySchema } = require("./validation/question-query.schema");

/**
 * ==========================================================
 * Question Validator Facade Exporter
 * ==========================================================
 */

module.exports = {
  createQuestionSchema,
  createQuestionBodySchema,
  updateQuestionSchema,
  updateQuestionBodySchema,
  questionIdParamSchema,
  questionQuerySchema,
  optionSchema,
};
