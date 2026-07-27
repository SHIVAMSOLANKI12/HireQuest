const authRepository = require("./repositories/auth.repository");
const refreshTokenRepository = require("./repositories/refresh-token.repository");
const auditLogRepository = require("./repositories/audit-log.repository");

/**
 * ==========================================================
 * Auth Module Repository Facade
 * ==========================================================
 * Centralized entry point aggregating Auth, Refresh Token, and Audit Log repositories.
 * ==========================================================
 */

module.exports = {
  ...authRepository,

  // Refresh Token operations
  createRefreshToken: refreshTokenRepository.createRefreshToken,
  findRefreshToken: refreshTokenRepository.findRefreshToken,
  revokeRefreshToken: refreshTokenRepository.revokeRefreshToken,
  revokeAllUserRefreshTokens: refreshTokenRepository.revokeAllUserRefreshTokens,
  deleteExpiredTokens: refreshTokenRepository.deleteExpiredTokens,

  // Audit Log operations
  createAuditLog: auditLogRepository.createAuditLog,
  findLogsByUserId: auditLogRepository.findLogsByUserId,
};
