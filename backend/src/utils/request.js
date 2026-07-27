/**
 * ==========================================================
 * Request Utility Helpers
 * ==========================================================
 * Extract client IP address and User-Agent behind proxies (Nginx/Cloudflare).
 * ==========================================================
 */

/**
 * Get Client IP Address
 *
 * @param {import('express').Request} req
 * @returns {string}
 */
const getClientIp = (req) => {
  if (!req) return "";
  const forwarded = req.headers && req.headers["x-forwarded-for"];
  if (forwarded) {
    const ip = typeof forwarded === "string" ? forwarded.split(",")[0] : forwarded[0];
    return ip ? ip.trim() : req.ip || "";
  }
  return req.ip || (req.socket && req.socket.remoteAddress) || "";
};

/**
 * Get User Agent Header
 *
 * @param {import('express').Request} req
 * @returns {string}
 */
const getUserAgent = (req) => {
  if (!req) return "";
  return req.get ? req.get("user-agent") || "" : "";
};

module.exports = {
  getClientIp,
  getUserAgent,
};
