const express = require("express");
const router = express.Router();

const validateRequest = require("../../middleware/validateRequest");
const requireAuth = require("../auth/middleware/requireAuth.middleware");
const requireRole = require("../auth/middleware/requireRole.middleware");
const { AUTH_ROLES } = require("../auth/auth.constants");

const controller = require("./category.controller");
const {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
  categoryQuerySchema,
} = require("./category.validator");

/**
 * ==========================================================
 * Question Category Module Routes
 * ==========================================================
 * Base Path: /api/v1/question-categories
 * Protected Routes: Requires Authentication (HR or SUPER_ADMIN Roles for mutation)
 * ==========================================================
 */

router.use(requireAuth);

/**
 * List Categories (Paginated, Searchable, Filterable, Sortable)
 * GET /api/v1/question-categories
 */
router.get(
  "/",
  validateRequest(categoryQuerySchema),
  controller.list
);

/**
 * Get Category By ID
 * GET /api/v1/question-categories/:id
 */
router.get(
  "/:id",
  validateRequest(categoryIdParamSchema),
  controller.getById
);

/**
 * Create Category
 * POST /api/v1/question-categories
 */
router.post(
  "/",
  requireRole(AUTH_ROLES.SUPER_ADMIN, AUTH_ROLES.HR),
  validateRequest(createCategorySchema),
  controller.create
);

/**
 * Update Category
 * PATCH /api/v1/question-categories/:id
 */
router.patch(
  "/:id",
  requireRole(AUTH_ROLES.SUPER_ADMIN, AUTH_ROLES.HR),
  validateRequest(updateCategorySchema),
  controller.update
);

/**
 * Soft Delete Category
 * DELETE /api/v1/question-categories/:id
 */
router.delete(
  "/:id",
  requireRole(AUTH_ROLES.SUPER_ADMIN, AUTH_ROLES.HR),
  validateRequest(categoryIdParamSchema),
  controller.delete
);

/**
 * Restore Soft Deleted Category
 * PATCH /api/v1/question-categories/:id/restore
 */
router.patch(
  "/:id/restore",
  requireRole(AUTH_ROLES.SUPER_ADMIN, AUTH_ROLES.HR),
  validateRequest(categoryIdParamSchema),
  controller.restore
);

module.exports = router;
