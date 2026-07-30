const express = require("express");
const router = express.Router();

const validateRequest = require("../../middleware/validateRequest");
const requireAuth = require("../auth/middleware/requireAuth.middleware");
const requireRole = require("../auth/middleware/requireRole.middleware");
const { AUTH_ROLES } = require("../auth/auth.constants");

const controller = require("./tag.controller");
const {
  createTagSchema,
  updateTagSchema,
  tagIdParamSchema,
  tagQuerySchema,
} = require("./tag.validator");

/**
 * ==========================================================
 * Question Tag Module Routes
 * ==========================================================
 * Base Path: /api/v1/question-tags
 * Protected Routes: Requires Authentication (HR or SUPER_ADMIN Roles for mutation)
 * ==========================================================
 */

router.use(requireAuth);

/**
 * List Tags (Paginated, Searchable, Filterable, Sortable)
 * GET /api/v1/question-tags
 */
router.get(
  "/",
  validateRequest(tagQuerySchema),
  controller.list
);

/**
 * Get Tag By ID
 * GET /api/v1/question-tags/:id
 */
router.get(
  "/:id",
  validateRequest(tagIdParamSchema),
  controller.getById
);

/**
 * Create Tag
 * POST /api/v1/question-tags
 */
router.post(
  "/",
  requireRole(AUTH_ROLES.SUPER_ADMIN, AUTH_ROLES.HR),
  validateRequest(createTagSchema),
  controller.create
);

/**
 * Update Tag
 * PATCH /api/v1/question-tags/:id
 */
router.patch(
  "/:id",
  requireRole(AUTH_ROLES.SUPER_ADMIN, AUTH_ROLES.HR),
  validateRequest(updateTagSchema),
  controller.update
);

/**
 * Soft Delete Tag
 * DELETE /api/v1/question-tags/:id
 */
router.delete(
  "/:id",
  requireRole(AUTH_ROLES.SUPER_ADMIN, AUTH_ROLES.HR),
  validateRequest(tagIdParamSchema),
  controller.delete
);

/**
 * Restore Soft Deleted Tag
 * PATCH /api/v1/question-tags/:id/restore
 */
router.patch(
  "/:id/restore",
  requireRole(AUTH_ROLES.SUPER_ADMIN, AUTH_ROLES.HR),
  validateRequest(tagIdParamSchema),
  controller.restore
);

module.exports = router;
