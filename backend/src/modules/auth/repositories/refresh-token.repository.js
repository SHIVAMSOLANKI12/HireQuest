const { prisma: defaultPrisma } = require("../../../config/prisma");

const resolveDbAndData = (first, second) => {
  const isFirstDb = typeof first === "object" && first !== null && (first.refreshToken || first.$transaction);
  const db = isFirstDb ? first : (typeof second === "object" && second !== null ? second : defaultPrisma);
  const data = isFirstDb ? second : first;
  return { db, data };
};

const resolveDbAndParam = (first, second) => {
  const isFirstDb = typeof first === "object" && first !== null && (first.refreshToken || first.$transaction);
  const db = isFirstDb ? first : (typeof second === "object" && second !== null ? second : defaultPrisma);
  const param = isFirstDb ? second : first;
  return { db, param };
};

/**
 * Save Refresh Token
 */
const createRefreshToken = (first, second) => {
  const { db, data } = resolveDbAndData(first, second);
  return db.refreshToken.create({
    data,
  });
};

/**
 * Find Refresh Token
 */
const findRefreshToken = (first, second) => {
  const { db, param: token } = resolveDbAndParam(first, second);
  return db.refreshToken.findUnique({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });
};

/**
 * Revoke Refresh Token
 */
const revokeRefreshToken = (first, second) => {
  const { db, param: id } = resolveDbAndParam(first, second);
  return db.refreshToken.update({
    where: {
      id,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};

/**
 * Revoke All User Refresh Tokens
 */
const revokeAllUserRefreshTokens = (first, second) => {
  const { db, param: userId } = resolveDbAndParam(first, second);
  return db.refreshToken.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};

/**
 * Delete Expired Refresh Tokens
 */
const deleteExpiredRefreshTokens = (db = defaultPrisma) => {
  const activeDb = typeof db === "object" && db !== null && (db.refreshToken || db.$transaction) ? db : defaultPrisma;
  return activeDb.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
};

/**
 * Delete Revoked Refresh Tokens
 */
const deleteRevokedRefreshTokens = (db = defaultPrisma) => {
  const activeDb = typeof db === "object" && db !== null && (db.refreshToken || db.$transaction) ? db : defaultPrisma;
  return activeDb.refreshToken.deleteMany({
    where: {
      revokedAt: {
        not: null,
      },
    },
  });
};

module.exports = {
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
  deleteExpiredRefreshTokens,
  deleteRevokedRefreshTokens,
};
