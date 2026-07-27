const { prisma: defaultPrisma } = require("../../config/prisma");

/**
 * ==========================================================
 * User Repository
 * ==========================================================
 * Centralized Data Access Layer for User entity queries & mutations.
 * Shared across all domain modules requiring user lookup.
 * Accepts optional Database/Transaction Client (db).
 * ==========================================================
 */

/**
 * Find User by Unique ID
 *
 * @param {string} id
 * @param {import('@prisma/client').PrismaClient} [db=defaultPrisma]
 * @returns {Promise<import('@prisma/client').User|null>}
 */
const findUserById = async (id, db = defaultPrisma) => {
  return db.user.findUnique({
    where: { id },
  });
};

/**
 * Find User by Unique Email
 *
 * @param {string} email
 * @param {import('@prisma/client').PrismaClient} [db=defaultPrisma]
 * @returns {Promise<import('@prisma/client').User|null>}
 */
const findUserByEmail = async (email, db = defaultPrisma) => {
  return db.user.findUnique({
    where: { email },
  });
};

/**
 * Create New User Record
 *
 * @param {Object} data
 * @param {import('@prisma/client').PrismaClient} [db=defaultPrisma]
 * @returns {Promise<import('@prisma/client').User>}
 */
const createUser = async (data, db = defaultPrisma) => {
  return db.user.create({
    data,
  });
};

/**
 * Increment Token Version (Global Logout / Revoke All Devices)
 *
 * @param {string} userId
 * @param {import('@prisma/client').PrismaClient} [db=defaultPrisma]
 * @returns {Promise<import('@prisma/client').User>}
 */
const incrementTokenVersion = async (userId, db = defaultPrisma) => {
  return db.user.update({
    where: { id: userId },
    data: {
      tokenVersion: {
        increment: 1,
      },
    },
  });
};

module.exports = {
  findUserById,
  findUserByEmail,
  createUser,
  incrementTokenVersion,
};
