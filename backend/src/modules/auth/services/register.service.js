const { runTransaction } = require("../../../config/prisma");
const ApiError = require("../../../utils/ApiError");
const authRepository = require("../repositories/auth.repository");
const auditLogRepository = require("../repositories/audit-log.repository");
const {
  hashPassword,
  validatePasswordStrength,
} = require("../utils/password");
const { toRegisterResponse } = require("../auth.mapper");
const {
  AUTH_ERRORS,
  AUTH_MESSAGES,
  AUTH_ROLES,
} = require("../auth.constants");

/**
 * ==========================================================
 * Register Service (ACID Transaction Safe)
 * ==========================================================
 * Business logic for user registration:
 * - Email Uniqueness Check
 * - Password Policy Validation
 * - Bcrypt Password Hashing
 * - Atomic Transaction: User Creation + Audit Logging
 * - Dynamic Role Assignment (HR / CANDIDATE / SUPER_ADMIN)
 * ==========================================================
 */

const register = async ({
  firstName,
  lastName,
  email,
  password,
  role,
  ipAddress,
  userAgent,
}) => {
  /**
   * Check Existing User
   */
  const existingUser = await authRepository.findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(
      409,
      AUTH_ERRORS.EMAIL_ALREADY_EXISTS
    );
  }

  /**
   * Validate Password
   */
  validatePasswordStrength(password);

  /**
   * Hash Password
   */
  const hashedPassword = await hashPassword(password);

  /**
   * Determine Target Role
   */
  const userRole = role && AUTH_ROLES[role] ? AUTH_ROLES[role] : AUTH_ROLES.CANDIDATE;

  /**
   * Execute User Creation & Audit Logging in an Atomic Transaction
   */
  const user = await runTransaction(async (tx) => {
    const newUser = await authRepository.createUser(
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: userRole,
        isActive: true,
        emailVerified: false,
      },
      tx
    );

    await auditLogRepository.createAuditLog(
      {
        userId: newUser.id,
        action: "CREATE",
        module: "AUTH",
        description: `User registered successfully as ${userRole}`,
        ipAddress,
        userAgent,
      },
      tx
    );

    return newUser;
  });

  return {
    message: AUTH_MESSAGES.REGISTER_SUCCESS,
    data: toRegisterResponse(user),
  };
};

module.exports = {
  register,
};
