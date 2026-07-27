const bcrypt = require("bcrypt");
const env = require("../../../config/env");
const ApiError = require("../../../utils/ApiError");
const { AUTH_ERRORS } = require("../auth.constants");

const SALT_ROUNDS = env.security.bcryptSaltRounds;

/**
 * =====================================================
 * Password Utility Module
 * =====================================================
 * Enterprise-grade utility for:
 * - Password Hashing using Bcrypt (Configurable Salt Rounds)
 * - Secure Password Comparison
 * - Strict Password Policy & Strength Validation
 * =====================================================
 */

/**
 * Hash Plain Password
 *
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password string
 */
const hashPassword = async (password) => {
  if (!password) {
    throw new ApiError(400, "Password is required for hashing.");
  }
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare Plain Password with Hashed Password
 *
 * @param {string} plainPassword - Plain text candidate password
 * @param {string} hashedPassword - Hashed password stored in DB
 * @returns {Promise<boolean>} Match result
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) {
    return false;
  }
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Password Policy Regex
 * Rules:
 * - Min 8, Max 64 characters
 * - At least 1 uppercase letter (A-Z)
 * - At least 1 lowercase letter (a-z)
 * - At least 1 digit (0-9)
 * - At least 1 special character (@$!%*?#&^()_\-+=)
 */
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&^()_\-+=])[A-Za-z\d@$!%*?#&^()_\-+=]{8,64}$/;

/**
 * Validate Password Strength
 *
 * @param {string} password - Plain text password
 * @throws {ApiError} 400 Bad Request if policy is violated
 */
const validatePasswordStrength = (password) => {
  if (!password || typeof password !== "string") {
    throw new ApiError(400, "Password is required.");
  }

  if (!PASSWORD_REGEX.test(password)) {
    throw new ApiError(400, AUTH_ERRORS.INVALID_PASSWORD_FORMAT);
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
  SALT_ROUNDS,
  PASSWORD_REGEX,
};
