const { prisma: defaultPrisma } = require("../../../config/prisma");

/**
 * Helper to resolve db context and data object polymorphic parameters
 */
const resolveDbAndData = (first, second) => {
  const isFirstDb = typeof first === "object" && first !== null && (first.auditLog || first.$transaction);
  const db = isFirstDb ? first : (typeof second === "object" && second !== null ? second : defaultPrisma);
  const data = isFirstDb ? second : first;
  return { db, data };
};

/**
 * Create Audit Log Record
 *
 * @param {Object|import('@prisma/client').PrismaClient} first
 * @param {Object|import('@prisma/client').PrismaClient} [second]
 * @returns {Promise<import('@prisma/client').AuditLog>}
 */
const createAuditLog = (first, second) => {
  const { db, data } = resolveDbAndData(first, second);
  return db.auditLog.create({
    data,
  });
};

/**
 * Find Audit Logs By User ID
 *
 * @param {string|import('@prisma/client').PrismaClient} first
 * @param {Object} [second]
 * @param {import('@prisma/client').PrismaClient} [third]
 * @returns {Promise<import('@prisma/client').AuditLog[]>}
 */
const findAuditLogsByUser = (first, second = {}, third) => {
  const isFirstDb = typeof first === "object" && first !== null && (first.auditLog || first.$transaction);
  const db = isFirstDb ? first : (typeof third === "object" && third !== null ? third : defaultPrisma);
  const userId = isFirstDb ? second : first;
  const options = isFirstDb ? (third || {}) : (second || {});

  const { skip = 0, take = 20 } = options;

  return db.auditLog.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take,
  });
};

/**
 * Find Audit Log By Unique ID
 */
const findAuditLogById = (first, second) => {
  const isFirstDb = typeof first === "object" && first !== null && (first.auditLog || first.$transaction);
  const db = isFirstDb ? first : (typeof second === "object" && second !== null ? second : defaultPrisma);
  const id = isFirstDb ? second : first;

  return db.auditLog.findUnique({
    where: {
      id,
    },
  });
};

/**
 * Delete Old Audit Logs
 */
const deleteAuditLogsBefore = (first, second) => {
  const isFirstDb = typeof first === "object" && first !== null && (first.auditLog || first.$transaction);
  const db = isFirstDb ? first : (typeof second === "object" && second !== null ? second : defaultPrisma);
  const beforeDate = isFirstDb ? second : first;

  return db.auditLog.deleteMany({
    where: {
      createdAt: {
        lt: beforeDate,
      },
    },
  });
};

module.exports = {
  createAuditLog,
  findAuditLogsByUser,
  findAuditLogById,
  deleteAuditLogsBefore,
};
