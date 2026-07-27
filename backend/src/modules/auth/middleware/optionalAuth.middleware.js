const { authenticateRequest } = require("../utils/authUser");

/**
 * ==========================================================
 * Optional Authentication Middleware
 * ==========================================================
 * Optional authentication check for public/semi-protected routes.
 * Sets req.user if valid token is present.
 * Allows request if token is missing.
 * Throws 401/403 if token is present but invalid/expired/disabled.
 * ==========================================================
 */

const optionalAuth = async (req, res, next) => {
  try {
    req.user = await authenticateRequest(req, { isOptional: true });
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = optionalAuth;
