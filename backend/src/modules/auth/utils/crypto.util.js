const crypto = require("crypto");

/**
 * ==========================================================
 * Crypto & Hashing Utility
 * ==========================================================
 * Provides fast, deterministic SHA-256 token hashing for database storage.
 * Ensures raw refresh tokens are never persisted in cleartext.
 * ==========================================================
 */

/**
 * Hash raw token string using SHA-256
 *
 * @param {string} token - Raw JWT or token string
 * @returns {string} SHA-256 hexadecimal hash string
 */
const hashToken = (token) => {
  if (!token || typeof token !== "string") {
    return "";
  }
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Compare plain token with hashed token
 *
 * @param {string} plainToken
 * @param {string} hashedToken
 * @returns {boolean}
 */
const compareToken = (plainToken, hashedToken) => {
  if (!plainToken || !hashedToken) {
    return false;
  }
  return hashToken(plainToken) === hashedToken;
};

module.exports = {
  hashToken,
  compareToken,
};
