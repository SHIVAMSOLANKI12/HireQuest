const ApiError = require("../../../utils/ApiError");
const { AUTH_ERRORS } = require("../auth.constants");

/**
 * ==========================================================
 * Role Based Authorization Middleware (RBAC)
 * ==========================================================
 * Enforces Role-Based Access Control on protected routes.
 * Must be executed AFTER requireAuth middleware.
 *
 * Usage Example:
 * const { AUTH_ROLES } = require("../auth.constants");
 *
 * router.post(
 *   "/assessments",
 *   requireAuth,
 *   requireRole(AUTH_ROLES.SUPER_ADMIN, AUTH_ROLES.HR),
 *   assessmentController.createAssessment
 * );
 * ==========================================================
 */

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return next(
          new ApiError(
            401,
            AUTH_ERRORS.TOKEN_REQUIRED
          )
        );
      }

      if (!allowedRoles.length) {
        return next(
          new ApiError(
            500,
            "No roles configured for this protected route."
          )
        );
      }

      if (!allowedRoles.includes(req.user.role)) {
        return next(
          new ApiError(
            403,
            AUTH_ERRORS.FORBIDDEN
          )
        );
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};

module.exports = requireRole;
