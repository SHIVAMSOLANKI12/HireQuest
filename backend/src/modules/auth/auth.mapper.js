/**
 * ==========================================================
 * Auth Mapper
 * ==========================================================
 * Responsible for:
 * - Mapping User domain entity to API Response
 * - Hiding sensitive database fields (password, tokenVersion, deletedAt, etc.)
 * ==========================================================
 */

/**
 * Map User Domain Entity to Safe User Response Object
 *
 * @param {Object} user
 * @returns {Object|null}
 */
const toUserResponse = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    emailVerified: user.emailVerified,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

/**
 * Login Response DTO Builder
 *
 * Access Token returned in body.
 * Refresh Token sent via HTTP-only Cookie.
 *
 * @param {Object} user
 * @param {string} accessToken
 */
const toLoginResponse = (user, accessToken) => ({
  user: toUserResponse(user),
  accessToken,
});

/**
 * Register Response DTO Builder
 *
 * @param {Object} user
 */
const toRegisterResponse = (user) => ({
  user: toUserResponse(user),
});

/**
 * Refresh Token Response DTO Builder
 *
 * @param {string} accessToken
 */
const toRefreshTokenResponse = (accessToken) => ({
  accessToken,
});

/**
 * Logout Response DTO Builder
 */
const toLogoutResponse = () => ({
  success: true,
});

/**
 * Profile Response DTO Builder
 *
 * @param {Object} user
 */
const toProfileResponse = (user) => ({
  user: toUserResponse(user),
});

module.exports = {
  toUserResponse,
  toLoginResponse,
  toRegisterResponse,
  toRefreshTokenResponse,
  toLogoutResponse,
  toProfileResponse,
};
