const express = require("express");
const router = express.Router();

const validateRequest = require("../../middleware/validateRequest");
const requireAuth = require("../auth/middleware/requireAuth.middleware");
const requireRole = require("../auth/middleware/requireRole.middleware");
const { AUTH_ROLES } = require("../auth/auth.constants");

const controller = require("./question.controller");
const { createQuestionSchema } = require("./question.validator");

/**
 * ==========================================================
 * Question Module Routes
 * ==========================================================
 * Base Path: /api/v1/questions
 * Protected Routes: Requires HR or SUPER_ADMIN Roles
 * ==========================================================
 */

router.use(requireAuth);

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

module.exports = router;
