const express = require("express");
const router = express.Router();

const validateRequest = require("../../middleware/validateRequest");
const requireAuth = require("../auth/middleware/requireAuth.middleware");
const requireRole = require("../auth/middleware/requireRole.middleware");
const { AUTH_ROLES } = require("../auth/auth.constants");

const controller = require("./question.controller");
const {
  createQuestionSchema,
  updateQuestionSchema,
  questionIdParamSchema,
  questionQuerySchema,
} = require("./question.validator");

/**
 * ==========================================================
 * Question Bank Module Routes
 * ==========================================================
 * Base Path: /api/v1/questions
 * Protected Routes: Requires Authentication (HR or SUPER_ADMIN Roles for mutation)
 * ==========================================================
 */

router.use(requireAuth);

/**
 * List Questions (Paginated, Searchable, Filterable by type/difficulty/status/category/tag)
 * GET /api/v1/questions
 */
router.get(
  "/",
  validateRequest(questionQuerySchema),
  controller.list
);

/**
 * Get Question By ID
 * GET /api/v1/questions/:id
 */
router.get(
  "/:id",
  validateRequest(questionIdParamSchema),
  controller.getById
);

/**
 * Create Question
 * POST /api/v1/questions
 */
router.post(
  "/",
  requireRole(AUTH_ROLES.SUPER_ADMIN, AUTH_ROLES.HR),
  validateRequest(createQuestionSchema),
  controller.create
);

/**
 * Update Question
 * PATCH /api/v1/questions/:id
 */
router.patch(
  "/:id",
  requireRole(AUTH_ROLES.SUPER_ADMIN, AUTH_ROLES.HR),
  validateRequest(updateQuestionSchema),
  controller.update
);

/**
 * Soft Delete Question
 * DELETE /api/v1/questions/:id
 */
router.delete(
  "/:id",
  requireRole(AUTH_ROLES.SUPER_ADMIN, AUTH_ROLES.HR),
  validateRequest(questionIdParamSchema),
  controller.delete
);

/**
 * Publish Question
 * POST /api/v1/questions/:id/publish
 */
router.post(
  "/:id/publish",
  requireRole(AUTH_ROLES.SUPER_ADMIN, AUTH_ROLES.HR),
  validateRequest(questionIdParamSchema),
  controller.publish
);

/**
 * Archive Question
 * POST /api/v1/questions/:id/archive
 */
router.post(
  "/:id/archive",
  requireRole(AUTH_ROLES.SUPER_ADMIN, AUTH_ROLES.HR),
  validateRequest(questionIdParamSchema),
  controller.archive
);

module.exports = router;
