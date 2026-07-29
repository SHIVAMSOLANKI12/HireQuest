const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");

const assessmentService = require("./assessment.service");

const {
  ASSESSMENT_MESSAGES,
} = require("./assessment.constants");

/**
 * ==========================================================
 * Assessment Controller
 * ==========================================================
 * Express HTTP handlers for Assessment module endpoints.
 * Contains ZERO business logic (delegates completely to services).
 * ==========================================================
 */

/**
 * Create Assessment Handler
 */
const createAssessment = asyncHandler(async (req, res) => {
  const result = await assessmentService.createAssessment({
    user: req.user,
    body: req.body,
  });

  const data = result?.data !== undefined ? result.data : result;
  const message = result?.message || ASSESSMENT_MESSAGES.CREATE_SUCCESS;

  return res.status(201).json(
    new ApiResponse(201, data, message)
  );
});

/**
 * Update Assessment Handler
 */
const updateAssessment = asyncHandler(async (req, res) => {
  const result = await assessmentService.updateAssessment({
    assessmentId: req.params.id,
    id: req.params.id,
    user: req.user,
    body: req.body,
  });

  const data = result?.data !== undefined ? result.data : result;
  const message = result?.message || ASSESSMENT_MESSAGES.UPDATE_SUCCESS;

  return res.status(200).json(
    new ApiResponse(200, data, message)
  );
});

/**
 * Get Assessment By ID Handler
 */
const getAssessment = asyncHandler(async (req, res) => {
  const result = await assessmentService.getAssessmentById({
    assessmentId: req.params.id,
    id: req.params.id,
  });

  const data = result?.data !== undefined ? result.data : result;
  const message = result?.message || ASSESSMENT_MESSAGES.ASSESSMENT_FETCHED;

  return res.status(200).json(
    new ApiResponse(200, data, message)
  );
});

/**
 * List Assessments Handler
 */
const listAssessments = asyncHandler(async (req, res) => {
  const result = await assessmentService.listAssessments({
    query: req.query,
  });

  const data = result?.data !== undefined ? result.data : result;
  const message = result?.message || ASSESSMENT_MESSAGES.ASSESSMENTS_FETCHED;

  return res.status(200).json(
    new ApiResponse(200, data, message)
  );
});

/**
 * Publish Assessment Handler
 */
const publishAssessment = asyncHandler(async (req, res) => {
  const result = await assessmentService.publishAssessment({
    assessmentId: req.params.id,
    id: req.params.id,
    user: req.user,
  });

  const data = result?.data !== undefined ? result.data : result;
  const message = result?.message || ASSESSMENT_MESSAGES.PUBLISH_SUCCESS;

  return res.status(200).json(
    new ApiResponse(200, data, message)
  );
});

/**
 * Archive Assessment Handler
 */
const archiveAssessment = asyncHandler(async (req, res) => {
  const result = await assessmentService.archiveAssessment({
    assessmentId: req.params.id,
    id: req.params.id,
    user: req.user,
  });

  const data = result?.data !== undefined ? result.data : result;
  const message = result?.message || ASSESSMENT_MESSAGES.ARCHIVE_SUCCESS;

  return res.status(200).json(
    new ApiResponse(200, data, message)
  );
});

/**
 * Duplicate Assessment Handler
 */
const duplicateAssessment = asyncHandler(async (req, res) => {
  const result = await assessmentService.duplicateAssessment({
    assessmentId: req.params.id,
    id: req.params.id,
    user: req.user,
  });

  const data = result?.data !== undefined ? result.data : result;
  const message = result?.message || ASSESSMENT_MESSAGES.DUPLICATE_SUCCESS;

  return res.status(201).json(
    new ApiResponse(201, data, message)
  );
});

/**
 * Delete Assessment Handler
 */
const deleteAssessment = asyncHandler(async (req, res) => {
  const result = await assessmentService.deleteAssessment({
    assessmentId: req.params.id,
    id: req.params.id,
    user: req.user,
  });

  const data = result?.data !== undefined ? result.data : result;
  const message = result?.message || ASSESSMENT_MESSAGES.DELETE_SUCCESS;

  return res.status(200).json(
    new ApiResponse(200, data, message)
  );
});

module.exports = {
  createAssessment,
  updateAssessment,
  getAssessment,
  listAssessments,
  publishAssessment,
  archiveAssessment,
  duplicateAssessment,
  deleteAssessment,
};
