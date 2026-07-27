const { prisma: defaultPrisma } = require("../../../config/prisma");

/**
 * ============================================================
 * Password Reset Repository
 * ============================================================
 * Production Data Access Layer for PasswordResetToken entity.
 * Supports both standalone prisma client & transaction client (tx).
 * ============================================================
 */

const resolveDbAndData = (first, second) => {
  const isFirstDb = typeof first === "object" && first !== null && (first.passwordResetToken || first.$transaction);
  const db = isFirstDb ? first : (typeof second === "object" && second !== null ? second : defaultPrisma);
  const data = isFirstDb ? second : first;
  return { db, data };
};

const resolveDbAndParam = (first, second) => {
  const isFirstDb = typeof first === "object" && first !== null && (first.passwordResetToken || first.$transaction);
  const db = isFirstDb ? first : (typeof second === "object" && second !== null ? second : defaultPrisma);
  const param = isFirstDb ? second : first;
  return { db, param };
};

/**
 * Create Password Reset Token
 *
 * @param {import('@prisma/client').PrismaClient|Object} first
 * @param {Object|import('@prisma/client').PrismaClient} [second]
 */
const createPasswordResetToken = (first, second) => {
  const { db, data } = resolveDbAndData(first, second);
  return db.passwordResetToken.create({
    data,
  });
};

/**
 * Find Password Reset Token By Hash
 *
 * @param {import('@prisma/client').PrismaClient|string} first
 * @param {string|import('@prisma/client').PrismaClient} [second]
 */
const findPasswordResetTokenByHash = (first, second) => {
  const { db, param: tokenHash } = resolveDbAndParam(first, second);
  return db.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: true,
    },
  });
};

/**
 * Find Active Password Reset Token For User
 *
 * @param {import('@prisma/client').PrismaClient|string} first
 * @param {string|import('@prisma/client').PrismaClient} [second]
 */
const findActivePasswordResetTokenByUserId = (first, second) => {
  const { db, param: userId } = resolveDbAndParam(first, second);
  return db.passwordResetToken.findFirst({
    where: {
      userId,
      usedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Mark Password Reset Token As Used
 *
 * @param {import('@prisma/client').PrismaClient|string} first
 * @param {string|import('@prisma/client').PrismaClient} [second]
 */
const markPasswordResetTokenAsUsed = (first, second) => {
  const { db, param: id } = resolveDbAndParam(first, second);
  return db.passwordResetToken.update({
    where: {
      id,
    },
    data: {
      usedAt: new Date(),
    },
  });
};

/**
 * Delete Password Reset Token
 *
 * @param {import('@prisma/client').PrismaClient|string} first
 * @param {string|import('@prisma/client').PrismaClient} [second]
 */
const deletePasswordResetToken = (first, second) => {
  const { db, param: id } = resolveDbAndParam(first, second);
  return db.passwordResetToken.delete({
    where: {
      id,
    },
  });
};

/**
 * Delete All Password Reset Tokens For User
 *
 * @param {import('@prisma/client').PrismaClient|string} first
 * @param {string|import('@prisma/client').PrismaClient} [second]
 */
const deleteAllPasswordResetTokensByUserId = (first, second) => {
  const { db, param: userId } = resolveDbAndParam(first, second);
  return db.passwordResetToken.deleteMany({
    where: {
      userId,
    },
  });
};

/**
 * Delete Expired Password Reset Tokens
 *
 * @param {import('@prisma/client').PrismaClient} [db=defaultPrisma]
 */
const deleteExpiredPasswordResetTokens = (db = defaultPrisma) => {
  const activeDb = typeof db === "object" && db !== null && (db.passwordResetToken || db.$transaction) ? db : defaultPrisma;
  return activeDb.passwordResetToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
};

module.exports = {
  createPasswordResetToken,
  findPasswordResetTokenByHash,
  findActivePasswordResetTokenByUserId,
  markPasswordResetTokenAsUsed,
  deletePasswordResetToken,
  deleteAllPasswordResetTokensByUserId,
  deleteExpiredPasswordResetTokens,
};
