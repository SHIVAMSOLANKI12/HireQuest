const createAssessment = require("./services/create-assessment.service");
const updateAssessment = require("./services/update-assessment.service");
const getAssessmentById = require("./services/get-assessment.service");
const listAssessments = require("./services/list-assessments.service");
const publishAssessment = require("./services/publish-assessment.service");
const archiveAssessment = require("./services/archive-assessment.service");
const duplicateAssessment = require("./services/duplicate-assessment.service");
const deleteAssessment = require("./services/delete-assessment.service");

/**
 * ==========================================================
 * Assessment Service Aggregator Facade
 * ==========================================================
 * Centralized entry point re-exporting modular assessment services.
 * ==========================================================
 */

module.exports = {
  createAssessment,
  updateAssessment,
  getAssessmentById,
  getAssessment: getAssessmentById,
  listAssessments,
  publishAssessment,
  archiveAssessment,
  duplicateAssessment,
  deleteAssessment,
};
