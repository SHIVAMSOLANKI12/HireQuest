const rateLimit = require("express-rate-limit");

/**
 * Global API Rate Limiter
 */
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    trustProxy: false,
  },
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

/**
 * Authentication Rate Limiter
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    trustProxy: false,
  },
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
});

module.exports = {
  globalRateLimiter,
  authRateLimiter,
};