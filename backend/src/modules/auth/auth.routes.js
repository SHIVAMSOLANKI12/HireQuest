const express = require("express");

const authController = require("./auth.controller");
const validateRequest = require("../../middleware/validateRequest");
const requireAuth = require("./middleware/requireAuth.middleware");

const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require("./auth.validator");

const router = express.Router();

/**
 * ======================================================
 * Public Authentication Routes
 * ======================================================
 */

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register
);

router.post(
  "/login",
  validateRequest(loginSchema),
  authController.login
);

router.post(
  "/refresh",
  authController.refreshToken
);

router.post(
  "/refresh-token",
  authController.refreshToken
);

router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  authController.resetPassword
);

/**
 * ======================================================
 * Protected Authentication Routes
 * ======================================================
 */

router.post(
  "/logout",
  requireAuth,
  authController.logout
);

router.post(
  "/logout-all",
  requireAuth,
  authController.logoutAllDevices
);

router.patch(
  "/change-password",
  requireAuth,
  validateRequest(changePasswordSchema),
  authController.changePassword
);

router.get(
  "/me",
  requireAuth,
  authController.getCurrentUser
);

module.exports = router;
