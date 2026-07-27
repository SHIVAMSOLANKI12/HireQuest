const ApiError = require("../../../utils/ApiError");

const { runTransaction } = require("../../../config/prisma");

const authRepository = require("../repositories/auth.repository");
const refreshTokenRepository = require("../repositories/refresh-token.repository");
const auditLogRepository = require("../repositories/audit-log.repository");

const {
  comparePassword,
  hashPassword,
  validatePasswordStrength,
} = require("../utils/password");

const {
  AUTH_ERRORS,
  AUTH_MESSAGES,
} = require("../auth.constants");

/**
 * ==========================================================
 * Change Password Service
 * ==========================================================
 * Enterprise Change Password Logic:
 * - Verifies current password validity
 * - Audits failed password change attempts
 * - Validates new password policy
 * - Prevents re-using current password
 * - Hashes new password with Bcrypt
 * - Updates user password in DB
 * - Increments user tokenVersion (Invalidates all active Access Tokens)
 * - Revokes all active refresh tokens (Forces re-authentication across all devices)
 * - Records Security Audit Log
 * ==========================================================
 */

/**
 * Change Password
 *
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.currentPassword
 * @param {string} params.newPassword
 * @param {string} [params.ipAddress]
 * @param {string} [params.userAgent]
 * @returns {Promise<Object>}
 */
const changePassword = async ({
  userId,
  currentPassword,
  newPassword,
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
     * 2. Verify Current Password
     */
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      /**
       * Audit Failed Password Change Attempt
       */
      await auditLogRepository.createAuditLog(
        tx,
        {
          userId: user.id,
          action: "UPDATE",
          module: "AUTH",
          description: "Password change failed - Invalid current password",
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
     * 3. Validate New Password Policy
     */
    validatePasswordStrength(newPassword);

    /**
     * 4. Prevent Re-using Same Password
     */
    const isSamePassword = await comparePassword(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      throw new ApiError(
        400,
        AUTH_ERRORS.PASSWORD_ALREADY_USED
      );
    }

    /**
     * 5. Hash New Password
     */
    const hashedPassword = await hashPassword(newPassword);

    /**
     * 6. Update User Password
     */
    await authRepository.updatePassword(
      tx,
      user.id,
      hashedPassword
    );

    /**
     * 7. Invalidate All Existing Access Tokens
     */
    await authRepository.incrementTokenVersion(
      tx,
      user.id
    );

    /**
     * 8. Revoke All Refresh Tokens Across Devices
     */
    await refreshTokenRepository.revokeAllUserRefreshTokens(
      tx,
      user.id
    );

    /**
     * 9. Create Audit Log
     */
    await auditLogRepository.createAuditLog(
      tx,
      {
        userId: user.id,
        action: "UPDATE",
        module: "AUTH",
        description: "User changed password successfully",
        ipAddress,
        userAgent,
      }
    );

    /**
     * 10. Return Success Response
     */
    return {
      message: AUTH_MESSAGES.PASSWORD_CHANGED_SUCCESS,
    };
  });
};

module.exports = {
  changePassword,
};
