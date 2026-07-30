const createQuestionService = require("./services/create-question.service");
const getQuestionsService = require("./services/get-questions.service");
const getQuestionService = require("./services/get-question.service");
const updateQuestionService = require("./services/update-question.service");
const deleteQuestionService = require("./services/delete-question.service");
const publishQuestionService = require("./services/publish-question.service");
const archiveQuestionService = require("./services/archive-question.service");

/**
 * ==========================================================
 * Question Service Aggregator Facade
 * ==========================================================
 * Central entry point for all Question domain business services.
 * ==========================================================
 */

module.exports = {
  createQuestion: (payload, userId) => createQuestionService.execute(payload, userId),
  getQuestions: (query) => getQuestionsService.execute(query),
  getQuestionById: (id) => getQuestionService.execute(id),
  updateQuestion: (id, payload, userId) => updateQuestionService.execute(id, payload, userId),
  deleteQuestion: (id, userId) => deleteQuestionService.execute(id, userId),
  publishQuestion: (id, userId) => publishQuestionService.execute(id, userId),
  archiveQuestion: (id, userId) => archiveQuestionService.execute(id, userId),

  createQuestionService,
  getQuestionsService,
  getQuestionService,
  updateQuestionService,
  deleteQuestionService,
  publishQuestionService,
  archiveQuestionService,
};
