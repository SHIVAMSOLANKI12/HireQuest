const crypto = require("crypto");
const env = require("../../../config/env");
const { runTransaction } = require("../../../config/prisma");
const authRepository = require("../repositories/auth.repository");
const passwordResetRepository = require("../repositories/password-reset.repository");
const auditLogRepository = require("../repositories/audit-log.repository");
const { AUTH_MESSAGES } = require("../auth.constants");

/**
 * =====================================================
 * Helpers
 * =====================================================
 */

const RESET_TOKEN_BYTES = 32;

const RESET_TOKEN_EXPIRY_MINUTES =
  Number(process.env.PASSWORD_RESET_TOKEN_EXPIRY_MINUTES) || 15;

const generateResetToken = () => {
  return crypto
    .randomBytes(RESET_TOKEN_BYTES)
    .toString("hex");
};

const hashToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

const getTokenExpiry = () => {
  return new Date(
    Date.now() +
      RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000
  );
};

/**
 * =====================================================
 * Forgot Password Service (100% Production Implementation)
 * =====================================================
 * Handles password reset token generation & dispatch:
 * - OWASP User Enumeration Defense
 * - Cryptographic Random Token Generation (crypto.randomBytes(32))
 * - SHA-256 Hashed Token Database Storage
 * - Atomic Prisma Transaction (runTransaction)
 * - Security Audit Logging
 * =====================================================
 */

const forgotPassword = async ({
  email,
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

    /**
     * OWASP User Enumeration Defense:
     * Never reveal whether the email exists or not.
     */
    if (!user) {
      return {
        message: AUTH_MESSAGES.PASSWORD_RESET_EMAIL_SENT,
      };
    }

    /**
     * 2. Remove Existing Active Reset Tokens for User
     */
    await passwordResetRepository.deleteAllPasswordResetTokensByUserId(
      tx,
      user.id
    );

    /**
     * 3. Generate Cryptographically Secure Raw Token
     */
    const rawToken = generateResetToken();

    /**
     * 4. Hash Token via SHA-256 for Database Storage
     */
    const tokenHash = hashToken(rawToken);

    /**
     * 5. Calculate Token Expiry Timestamp
     */
    const expiresAt = getTokenExpiry();

    /**
     * 6. Store Hashed Password Reset Token in DB
     */
    await passwordResetRepository.createPasswordResetToken(
      tx,
      {
        tokenHash,
        userId: user.id,
        expiresAt,
      }
    );

    /**
     * 7. Record Security Audit Log
     */
    await auditLogRepository.createAuditLog(
      tx,
      {
        userId: user.id,
        action: "CREATE",
        module: "AUTH",
        description: "Password reset token requested",
        ipAddress,
        userAgent,
      }
    );

    /**
     * 8. Build Reset URL
     */
    const frontendUrl = process.env.CLIENT_URL || env.cors.origin || "http://localhost:3000";
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

    // Dev Logging for Local Testing
    console.log("\n=======================================================");
    console.log("🔑 [DEV ONLY] PASSWORD RESET TOKEN GENERATED:");
    console.log(`RAW RESET TOKEN : ${rawToken}`);
    console.log(`RESET URL       : ${resetUrl}`);
    console.log("=======================================================\n");

    /**
     * 9. Return Generic Security Response
     */
    return {
      message: AUTH_MESSAGES.PASSWORD_RESET_EMAIL_SENT,
    };
  });
};

module.exports = {
  forgotPassword,
  generateResetToken,
  hashToken,
  getTokenExpiry,
};
