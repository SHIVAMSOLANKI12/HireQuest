const { prisma: defaultPrisma } = require("../../../config/prisma");
const { AUTH_USER_SELECT } = require("../selects/auth.select");
const refreshTokenRepository = require("./refresh-token.repository");
const auditLogRepository = require("./audit-log.repository");
const passwordResetRepository = require("./password-reset.repository");

/**
 * Helper to resolve db context and string parameter cleanly
 */
const resolveDbAndParam = (first, second) => {
  const isFirstDb = typeof first === "object" && first !== null && typeof first.user !== "undefined";
  const db = isFirstDb ? first : (typeof second === "object" && second !== null ? second : defaultPrisma);
  const param = isFirstDb ? second : first;
  return { db, param };
};

const resolveDbAndData = (first, second) => {
  const isFirstDb = typeof first === "object" && first !== null && (first.user || first.$transaction);
  const db = isFirstDb ? first : (typeof second === "object" && second !== null ? second : defaultPrisma);
  const data = isFirstDb ? second : first;
  return { db, data };
};

/**
 * Find user by email
 */
const findUserByEmail = (first, second) => {
  const { db, param: email } = resolveDbAndParam(first, second);
  return db.user.findUnique({
    where: { email },
    select: AUTH_USER_SELECT,
  });
};

/**
 * Find user by id
 */
const findUserById = (first, second) => {
  const { db, param: id } = resolveDbAndParam(first, second);
  return db.user.findUnique({
    where: { id },
    select: AUTH_USER_SELECT,
  });
};

/**
 * Create User
 */
const createUser = (first, second) => {
  const { db, data } = resolveDbAndData(first, second);
  return db.user.create({
    data,
    select: AUTH_USER_SELECT,
  });
};

/**
 * Update Last Login Timestamp
 */
const updateLastLogin = (first, second) => {
  const { db, param: id } = resolveDbAndParam(first, second);
  return db.user.update({
    where: { id },
    data: { lastLoginAt: new Date() },
    select: AUTH_USER_SELECT,
  });
};

/**
 * Update Password
 */
const updatePassword = (first, second, third) => {
  const isFirstDb = typeof first === "object" && first !== null && first.user;
  const db = isFirstDb ? first : defaultPrisma;
  const id = isFirstDb ? second : first;
  const password = isFirstDb ? third : second;

  return db.user.update({
    where: { id },
    data: {
      password,
      tokenVersion: { increment: 1 },
    },
    select: AUTH_USER_SELECT,
  });
};

/**
 * Increment Token Version
 */
const incrementTokenVersion = (first, second) => {
  const { db, param: id } = resolveDbAndParam(first, second);
  return db.user.update({
    where: { id },
    data: {
      tokenVersion: { increment: 1 },
    },
    select: AUTH_USER_SELECT,
  });
};

/**
 * Verify Email
 */
const verifyEmail = (first, second) => {
  const { db, param: id } = resolveDbAndParam(first, second);
  return db.user.update({
    where: { id },
    data: { emailVerified: true },
    select: AUTH_USER_SELECT,
  });
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateLastLogin,
  updatePassword,
  incrementTokenVersion,
  verifyEmail,

  // Refresh Token Delegation
  createRefreshToken: refreshTokenRepository.createRefreshToken,
  findRefreshToken: refreshTokenRepository.findRefreshToken,
  revokeRefreshToken: refreshTokenRepository.revokeRefreshToken,
  revokeAllUserRefreshTokens: refreshTokenRepository.revokeAllUserRefreshTokens,
  deleteExpiredRefreshTokens: refreshTokenRepository.deleteExpiredRefreshTokens,
  deleteRevokedRefreshTokens: refreshTokenRepository.deleteRevokedRefreshTokens,

  // Audit Log Delegation
  createAuditLog: auditLogRepository.createAuditLog,
  findAuditLogsByUser: auditLogRepository.findAuditLogsByUser,
  findAuditLogById: auditLogRepository.findAuditLogById,
  deleteAuditLogsBefore: auditLogRepository.deleteAuditLogsBefore,

  // Password Reset Delegation
  createPasswordResetToken: passwordResetRepository.createPasswordResetToken,
  findPasswordResetTokenByHash: passwordResetRepository.findPasswordResetTokenByHash,
  findActivePasswordResetTokenByUserId: passwordResetRepository.findActivePasswordResetTokenByUserId,
  markPasswordResetTokenAsUsed: passwordResetRepository.markPasswordResetTokenAsUsed,
  deletePasswordResetToken: passwordResetRepository.deletePasswordResetToken,
  deleteAllPasswordResetTokensByUserId: passwordResetRepository.deleteAllPasswordResetTokensByUserId,
  deleteExpiredPasswordResetTokens: passwordResetRepository.deleteExpiredPasswordResetTokens,
};
