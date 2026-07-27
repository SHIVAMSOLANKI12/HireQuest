const crypto = require("crypto");
const ApiError = require("../../../utils/ApiError");
const { runTransaction } = require("../../../config/prisma");
const authRepository = require("../repositories/auth.repository");
const refreshTokenRepository = require("../repositories/refresh-token.repository");
const auditLogRepository = require("../repositories/audit-log.repository");
const { verifyRefreshToken } = require("../utils/jwt");
const { AUTH_ERRORS, AUTH_MESSAGES } = require("../auth.constants");

/**
 * ==========================================================
 * Logout Service
 * ==========================================================
 * Enterprise Session & Device Invalidation Logic:
 * - Single Device Logout (Revokes current refresh token)
 * - All-Devices Logout (Increments user tokenVersion & revokes all active refresh tokens)
 * - Atomic Prisma Transactions (runTransaction)
 * - Audit Logging for Security Audits
 * ==========================================================
 */

/**
 * Hash Refresh Token using SHA-256
 *
 * @param {string} token
 * @returns {string} SHA-256 hexadecimal string
 */
const hashRefreshToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

/**
 * Logout Current Device
 *
 * @param {Object} params
 * @param {string} params.refreshToken
 * @param {string} [params.ipAddress]
 * @param {string} [params.userAgent]
 * @returns {Promise<Object>} Object with success message
 */
const logout = async ({
  refreshToken,
  ipAddress,
  userAgent,
}) => {
  return runTransaction(async (tx) => {
    if (!refreshToken) {
      throw new ApiError(
        401,
        AUTH_ERRORS.TOKEN_REQUIRED
      );
    }

    /**
     * 1. Verify Refresh Token JWT Signature & Expiry
     */
    verifyRefreshToken(refreshToken);

    /**
     * 2. Hash Token via SHA-256
     */
    const hashedToken = hashRefreshToken(refreshToken);

    /**
     * 3. Find Stored Token in Database
     */
    const storedToken = await refreshTokenRepository.findRefreshToken(
      tx,
      hashedToken
    );

    if (!storedToken) {
      throw new ApiError(
        401,
        AUTH_ERRORS.INVALID_REFRESH_TOKEN
      );
    }

    if (storedToken.revokedAt) {
      throw new ApiError(
        401,
        AUTH_ERRORS.INVALID_REFRESH_TOKEN
      );
    }

    /**
     * 4. Revoke Refresh Token
     */
    await refreshTokenRepository.revokeRefreshToken(
      tx,
      storedToken.id
    );

    /**
     * 5. Record Audit Log
     */
    await auditLogRepository.createAuditLog(
      tx,
      {
        userId: storedToken.userId,
        action: "LOGOUT",
        module: "AUTH",
        description: "User logged out from current device",
        ipAddress,
        userAgent,
      }
    );

    /**
     * 6. Return Response Message
     */
    return {
      message: AUTH_MESSAGES.LOGOUT_SUCCESS,
    };
  });
};

/**
 * Logout From All Devices
 *
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} [params.ipAddress]
 * @param {string} [params.userAgent]
 * @returns {Promise<Object>} Object with success message
 */
const logoutAllDevices = async ({
  userId,
  ipAddress,
  userAgent,
}) => {
  return runTransaction(async (tx) => {
    /**
     * 1. Find User by ID
     */
    const user = await authRepository.findUserById(
      tx,
      userId
    );

    if (!user) {
      throw new ApiError(
        404,
        AUTH_ERRORS.ACCOUNT_NOT_FOUND
      );
    }

    /**
     * 2. Increment Token Version (Invalidates all active Access Tokens instantly)
     */
    await authRepository.incrementTokenVersion(
      tx,
      user.id
    );

    /**
     * 3. Revoke All Refresh Tokens in Database
     */
    await refreshTokenRepository.revokeAllUserRefreshTokens(
      tx,
      user.id
    );

    /**
     * 4. Record Audit Log
     */
    await auditLogRepository.createAuditLog(
      tx,
      {
        userId: user.id,
        action: "LOGOUT",
        module: "AUTH",
        description: "User logged out from all devices",
        ipAddress,
        userAgent,
      }
    );

    return {
      message: AUTH_MESSAGES.LOGOUT_ALL_DEVICES_SUCCESS,
    };
  });
};

module.exports = {
  logout,
  logoutAllDevices,
  hashRefreshToken,
};
