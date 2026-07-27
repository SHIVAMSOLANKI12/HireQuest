const { authenticateRequest } = require("../utils/authUser");

/**
 * ==========================================================
 * Require Authentication Middleware
 * ==========================================================
 * Mandatory authentication check for protected routes.
 * Throws 401/403 if token is missing, invalid, expired,
 * or user is disabled/version-mismatched.
 * ==========================================================
 */

const requireAuth = async (req, res, next) => {
  try {
    req.user = await authenticateRequest(req, { isOptional: false });
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = requireAuth;
