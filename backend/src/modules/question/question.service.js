const createQuestionService = require("./services/create-question.service");

/**
 * ==========================================================
 * Question Service Aggregator Facade
 * ==========================================================
 * Central entry point for all Question domain business services.
 * ==========================================================
 */

module.exports = {
  createQuestion: (payload, userId) => createQuestionService.execute(payload, userId),
  createQuestionService,
};
