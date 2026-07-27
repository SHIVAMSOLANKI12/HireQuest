const crypto = require("crypto");
const env = require("../../../config/env");
const ApiError = require("../../../utils/ApiError");

const { runTransaction } = require("../../../config/prisma");

const authRepository = require("../repositories/auth.repository");
const refreshTokenRepository = require("../repositories/refresh-token.repository");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

const {
  AUTH_ERRORS,
  AUTH_MESSAGES,
} = require("../auth.constants");

/**
 * ==========================================================
 * Refresh Token Service
 * ==========================================================
 * Enterprise Refresh Token Rotation (RTR) & Silent Refresh:
 * - Validates Refresh JWT Signature & Expiration
 * - Checks SHA-256 Hashed Token in Database
 * - Automatic Theft Mitigation (Revokes all tokens if reuse detected)
 * - Validates Account Active Status & Token Version Sync
 * - Revokes Current Refresh Token (Anti-Replay Protection)
 * - Generates & Hashes New Refresh Token
 * - Atomic Prisma Transaction (runTransaction)
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
 * Get Refresh Token Expiry Timestamp
 *
 * @returns {Date}
 */
const getRefreshTokenExpiry = () => {
  return new Date(Date.now() + env.jwt.refreshTokenTTL);
};

/**
 * Refresh Access Token (Complete 100% Implementation)
 *
 * @param {string} refreshToken - Raw refresh token string from HTTP-only cookie
 * @returns {Promise<Object>} Object containing accessToken, refreshToken, user, message
 */
const refreshAccessToken = async (refreshToken) => {
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
    const payload = verifyRefreshToken(refreshToken);

    /**
     * 2. Hash incoming token via SHA-256 for DB lookup
     */
    const hashedToken = hashRefreshToken(refreshToken);

    /**
     * 3. Find Stored Refresh Token in Database
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

    /**
     * 4. Token Reuse / Theft Detection:
     * If an already revoked token is used, trigger security revocation for all active user tokens.
     */
    if (storedToken.revokedAt) {
      await refreshTokenRepository.revokeAllUserRefreshTokens(tx, storedToken.userId);
      throw new ApiError(
        401,
        AUTH_ERRORS.INVALID_REFRESH_TOKEN
      );
    }

    if (storedToken.expiresAt < new Date()) {
      throw new ApiError(
        401,
        AUTH_ERRORS.TOKEN_EXPIRED
      );
    }

    /**
     * 5. Validate User Account Existence & Status
     */
    const user = await authRepository.findUserById(
      tx,
      payload.sub
    );

    if (!user) {
      throw new ApiError(
        401,
        AUTH_ERRORS.ACCOUNT_NOT_FOUND
      );
    }

    if (!user.isActive) {
      throw new ApiError(
        403,
        AUTH_ERRORS.ACCOUNT_DISABLED
      );
    }

    /**
     * 6. Token Version Validation
     */
    if (
      payload.tokenVersion !== undefined &&
      payload.tokenVersion !== user.tokenVersion
    ) {
      throw new ApiError(
        401,
        AUTH_ERRORS.INVALID_REFRESH_TOKEN
      );
    }

    /**
     * 7. Revoke Current Refresh Token (RTR)
     */
    await refreshTokenRepository.revokeRefreshToken(
      tx,
      storedToken.id
    );

    /**
     * 8. Generate New Access Token
     */
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    /**
     * 9. Generate New Refresh Token
     */
    const newRefreshToken = generateRefreshToken({
      id: user.id,
      tokenVersion: user.tokenVersion,
    });

    /**
     * 10. Hash New Refresh Token
     */
    const hashedNewRefreshToken = hashRefreshToken(newRefreshToken);

    /**
     * 11. Save New Hashed Refresh Token in DB
     */
    await refreshTokenRepository.createRefreshToken(
      tx,
      {
        token: hashedNewRefreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      }
    );

    /**
     * 12. Return New Tokens & User Context to Controller
     */
    return {
      message: AUTH_MESSAGES.TOKEN_REFRESHED,
      accessToken,
      refreshToken: newRefreshToken,
      user,
    };
  });
};

module.exports = {
  refreshAccessToken,
  hashRefreshToken,
  getRefreshTokenExpiry,
};
