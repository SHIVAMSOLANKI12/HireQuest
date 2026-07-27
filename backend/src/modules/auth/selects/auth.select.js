/**
 * ==========================================================
 * Auth Prisma Select Configurations
 * ==========================================================
 * Explicit query projections for database efficiency & security.
 * ==========================================================
 */

/**
 * Auth User Projection (Includes password hash for login verification)
 */
const AUTH_USER_SELECT = Object.freeze({
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  password: true,
  role: true,
  isActive: true,
  emailVerified: true,
  tokenVersion: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Safe User Projection (Excludes password hash)
 */
const SAFE_USER_SELECT = Object.freeze({
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  isActive: true,
  emailVerified: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
});

module.exports = {
  AUTH_USER_SELECT,
  SAFE_USER_SELECT,
};
