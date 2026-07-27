const ApiError = require("../../../utils/ApiError");
const { verifyAccessToken } = require("./jwt");
const userRepository = require("../../user/user.repository");
const { AUTH_ERRORS } = require("../auth.constants");

/**
 * ==========================================================
 * Request Authentication Helper
 * ==========================================================
 * Single Source of Truth for validating HTTP Bearer Tokens,
 * verifying database user state, checking active status & token version.
 * Used by requireAuth and optionalAuth middlewares.
 * ==========================================================
 */

/**
 * Authenticate HTTP Request
 *
 * @param {import('express').Request} req
 * @param {Object} [options]
 * @param {boolean} [options.isOptional=false]
 * @returns {Promise<Object|null>} User context object or null if optional & missing
 */
const authenticateRequest = async (req, { isOptional = false } = {}) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    if (isOptional) return null;
    throw new ApiError(401, AUTH_ERRORS.TOKEN_REQUIRED);
  }

  if (!authorization.startsWith("Bearer ")) {
    throw new ApiError(401, AUTH_ERRORS.INVALID_TOKEN);
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    throw new ApiError(401, AUTH_ERRORS.INVALID_TOKEN);
  }

  const payload = verifyAccessToken(token);

  const user = await userRepository.findUserById(payload.sub);

  if (!user) {
    throw new ApiError(401, AUTH_ERRORS.ACCOUNT_NOT_FOUND);
  }

  if (!user.isActive) {
    throw new ApiError(403, AUTH_ERRORS.ACCOUNT_DISABLED);
  }

  if (
    payload.tokenVersion !== undefined &&
    payload.tokenVersion !== user.tokenVersion
  ) {
    throw new ApiError(401, AUTH_ERRORS.INVALID_TOKEN);
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    tokenVersion: user.tokenVersion,
  };
};

module.exports = {
  authenticateRequest,
};
