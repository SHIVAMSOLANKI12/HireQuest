const crypto = require("crypto");
const env = require("../../../config/env");
const ApiError = require("../../../utils/ApiError");

const { runTransaction } = require("../../../config/prisma");

const authRepository = require("../repositories/auth.repository");
const refreshTokenRepository = require("../repositories/refresh-token.repository");
const auditLogRepository = require("../repositories/audit-log.repository");

const {
  comparePassword,
} = require("../utils/password");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt");

const {
  AUTH_ERRORS,
  AUTH_MESSAGES,
} = require("../auth.constants");

/**
 * ==========================================================
 * Login Service
 * ==========================================================
 * Enterprise Authentication Business Logic:
 * - Atomic Prisma Transaction (runTransaction)
 * - Secure Email & Password Validation
 * - Account Active & Email Verification Guards
 * - Access Token & Refresh Token Generation
 * - Cryptographic SHA-256 Hashed Refresh Token Storage
 * - User Last Login Timestamp Update
 * - Success & Failed Login Audit Logging
 * ==========================================================
 */

/**
 * Hash Refresh Token using SHA-256
 *
 * Raw Refresh Tokens are never stored in plain text inside DB.
 *
 * @param {string} refreshToken
 * @returns {string} SHA-256 hex string
 */
const hashRefreshToken = (refreshToken) => {
  return crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
};

/**
 * Build Refresh Token Expiry Timestamp
 *
 * @returns {Date}
 */
const getRefreshTokenExpiry = () => {
  return new Date(Date.now() + env.jwt.refreshTokenTTL);
};

/**
 * Login User
 *
 * Returns raw refreshToken to Controller ONLY for HTTP-only cookie setting.
 *
 * @param {Object} payload
 * @param {string} payload.email
 * @param {string} payload.password
 * @param {string} [payload.ipAddress]
 * @param {string} [payload.userAgent]
 * @returns {Promise<Object>} Object containing accessToken, refreshToken, user, message
 */
const login = async ({
  email,
  password,
  ipAddress,
  userAgent,
}) => {
  return runTransaction(async (tx) => {
    /**
     * 1. Find User by Email
     */
    const user = await authRepository.findUserByEmail(
      tx,
      email
    );

    if (!user) {
      throw new ApiError(
        401,
        AUTH_ERRORS.INVALID_CREDENTIALS
      );
    }

    /**
     * 2. Account Active Check
     */
    if (!user.isActive) {
      throw new ApiError(
        403,
        AUTH_ERRORS.ACCOUNT_DISABLED
      );
    }

    /**
     * 3. Email Verification Check
     */
    if (
      env.auth.requireEmailVerification &&
      !user.emailVerified
    ) {
      throw new ApiError(
        403,
        AUTH_ERRORS.EMAIL_NOT_VERIFIED
      );
    }

    /**
     * 4. Password Verification
     */
    const isPasswordValid = await comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      /**
       * Audit Failed Login Attempt
       */
      await auditLogRepository.createAuditLog(
        tx,
        {
          userId: user.id,
          action: "CREATE",
          module: "AUTH",
          description: "Login failed - Invalid password",
          ipAddress,
          userAgent,
        }
      );

      throw new ApiError(
        401,
        AUTH_ERRORS.INVALID_CREDENTIALS
      );
    }

    /**
     * 5. Generate Access & Refresh Tokens
     */
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      tokenVersion: user.tokenVersion,
    });

    /**
     * 6. Hash Refresh Token via SHA-256
     */
    const hashedRefreshToken = hashRefreshToken(refreshToken);

    /**
     * 7. Save Hashed Refresh Token to DB
     */
    await refreshTokenRepository.createRefreshToken(
      tx,
      {
        token: hashedRefreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      }
    );

    /**
     * 8. Update Last Login Timestamp
     */
    await authRepository.updateLastLogin(
      tx,
      user.id
    );

    /**
     * 9. Audit Successful Login
     */
    await auditLogRepository.createAuditLog(
      tx,
      {
        userId: user.id,
        action: "LOGIN",
        module: "AUTH",
        description: "User logged in successfully",
        ipAddress,
        userAgent,
      }
    );

    /**
     * 10. Return Result to Controller
     */
    return {
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      accessToken,
      refreshToken,
      user,
    };
  });
};

module.exports = {
  login,
  hashRefreshToken,
  getRefreshTokenExpiry,
};
