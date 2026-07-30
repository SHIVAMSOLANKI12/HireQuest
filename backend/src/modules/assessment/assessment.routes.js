const express = require("express");
const router = express.Router();

const validateRequest = require("../../middleware/validateRequest");
const requireAuth = require("../auth/middleware/requireAuth.middleware");
const requireRole = require("../auth/middleware/requireRole.middleware");
const { AUTH_ROLES } = require("../auth/auth.constants");

const controller = require("./assessment.controller");
const {
  createAssessmentSchema,
  updateAssessmentSchema,
  assessmentIdParamSchema,
  assessmentQuerySchema,
} = require("./assessment.validator");

/**
 * ==========================================================
 * Assessment Module Routes
 * ==========================================================
 * Base Path: /api/v1/assessments
 * Protected Routes with Authentication, RBAC & Zod Validation
 * ==========================================================
 */

/**
 * Create Assessment
 * POST /api/v1/assessments
 */
router.post(
  "/",
  requireAuth,
  requireRole(AUTH_ROLES.SUPER_ADMIN, AUTH_ROLES.HR),
  validateRequest(createAssessmentSchema),
  controller.createAssessment
);

/**
 * Get All Assessments
 * GET /api/v1/assessments
 */
router.get(
  "/",
  requireAuth,
  validateRequest(assessmentQuerySchema),
  controller.listAssessments
);

/**
 * Get Assessment By ID
 * GET /api/v1/assessments/:id
 */
router.get(
  "/:id",
  requireAuth,
  validateRequest(assessmentIdParamSchema),
  controller.getAssessment
);

/**
 * Update Assessment
 * PATCH /api/v1/assessments/:id
 */
router.patch(
  "/:id",
  requireAuth,
  requireRole(AUTH_ROLES.SUPER_ADMIN, AUTH_ROLES.HR),
  validateRequest(updateAssessmentSchema),
  controller.updateAssessment
);

/**
 * Publish Assessment
 * PATCH /api/v1/assessments/:id/publish
 */
router.patch(
  "/:id/publish",
  requireAuth,
  requireRole(AUTH_ROLES.SUPER_ADMIN, AUTH_ROLES.HR),
  validateRequest(assessmentIdParamSchema),
  controller.publishAssessment
);

/**
 * Archive Assessment
 * PATCH /api/v1/assessments/:id/archive
 */
router.patch(
  "/:id/archive",
  requireAuth,
  requireRole(AUTH_ROLES.SUPER_ADMIN, AUTH_ROLES.HR),
  validateRequest(assessmentIdParamSchema),
  controller.archiveAssessment
);

/**
 * Duplicate Assessment
 * POST /api/v1/assessments/:id/duplicate
 */
router.post(
  "/:id/duplicate",
  requireAuth,
  requireRole(AUTH_ROLES.SUPER_ADMIN, AUTH_ROLES.HR),
  validateRequest(assessmentIdParamSchema),
  controller.duplicateAssessment
);

/**
 * Soft Delete Assessment
 * DELETE /api/v1/assessments/:id
 */
router.delete(
  "/:id",
  requireAuth,
  requireRole(AUTH_ROLES.SUPER_ADMIN, AUTH_ROLES.HR),
  validateRequest(assessmentIdParamSchema),
  controller.deleteAssessment
);

module.exports = router;
