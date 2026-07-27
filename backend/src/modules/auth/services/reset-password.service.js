const crypto = require("crypto");
const ApiError = require("../../../utils/ApiError");
const { runTransaction } = require("../../../config/prisma");
const authRepository = require("../repositories/auth.repository");
const passwordResetRepository = require("../repositories/password-reset.repository");
const refreshTokenRepository = require("../repositories/refresh-token.repository");
const auditLogRepository = require("../repositories/audit-log.repository");

const {
  hashPassword,
  validatePasswordStrength,
} = require("../utils/password");

const {
  AUTH_ERRORS,
  AUTH_MESSAGES,
} = require("../auth.constants");

/**
 * ======================================================
 * Helpers
 * ======================================================
 */

const hashToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

/**
 * ======================================================
 * Reset Password Service (100% Complete Implementation)
 * ======================================================
 * Validates reset token, updates user password, marks reset token as used,
 * invalidates all existing sessions (increments tokenVersion), revokes all refresh tokens,
 * and records security audit log.
 * ======================================================
 */

const resetPassword = async ({
  token,
  newPassword,
  ipAddress,
  userAgent,
}) => {
  return runTransaction(async (tx) => {
    /**
     * 1. Validate Token Parameter
     */
    if (!token) {
      throw new ApiError(
        400,
        AUTH_ERRORS.INVALID_RESET_TOKEN
      );
    }

    /**
     * 2. Validate Password Strength Policy
     */
    validatePasswordStrength(newPassword);

    /**
     * 3. SHA-256 Hash Incoming Token for DB Lookup
     */
    const tokenHash = hashToken(token);

    /**
     * 4. Find Reset Token in DB
     */
    const resetToken = await passwordResetRepository.findPasswordResetTokenByHash(
      tx,
      tokenHash
    );

    if (!resetToken) {
      throw new ApiError(
        400,
        AUTH_ERRORS.INVALID_RESET_TOKEN
      );
    }

    /**
     * 5. Check if Token Was Already Used
     */
    if (resetToken.usedAt) {
      throw new ApiError(
        400,
        AUTH_ERRORS.INVALID_RESET_TOKEN
      );
    }

    /**
     * 6. Check Token Expiration
     */
    if (resetToken.expiresAt < new Date()) {
      throw new ApiError(
        400,
        AUTH_ERRORS.TOKEN_EXPIRED
      );
    }

    /**
     * 7. User Account Validation
     */
    const user = resetToken.user;

    if (!user) {
      throw new ApiError(
        404,
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
     * 8. Hash New Password
     */
    const hashedPassword = await hashPassword(newPassword);

    /**
     * 9. Update Password in Database
     */
    await authRepository.updatePassword(
      tx,
      user.id,
      hashedPassword
    );

    /**
     * 10. Mark Reset Token As Used
     */
    await passwordResetRepository.markPasswordResetTokenAsUsed(
      tx,
      resetToken.id
    );

    /**
     * 11. Delete Remaining Password Reset Tokens for User
     */
    await passwordResetRepository.deleteAllPasswordResetTokensByUserId(
      tx,
      user.id
    );

    /**
     * 12. Increment Token Version (Invalidates all existing access tokens instantly)
     */
    await authRepository.incrementTokenVersion(
      tx,
      user.id
    );

    /**
     * 13. Revoke All Refresh Tokens Across All Devices
     */
    await refreshTokenRepository.revokeAllUserRefreshTokens(
      tx,
      user.id
    );

    /**
     * 14. Create Security Audit Log
     */
    await auditLogRepository.createAuditLog(
      tx,
      {
        userId: user.id,
        action: "UPDATE",
        module: "AUTH",
        description: "Password reset completed via token",
        ipAddress,
        userAgent,
      }
    );

    /**
     * 15. Return Success Message
     */
    return {
      message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS,
    };
  });
};

module.exports = {
  resetPassword,
  hashToken,
};
