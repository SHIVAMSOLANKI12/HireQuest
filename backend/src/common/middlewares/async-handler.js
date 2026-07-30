/**
 * ==========================================================
 * Async Handler Wrapper Middleware
 * ==========================================================
 * Wraps asynchronous controller route handlers to forward unhandled promise
 * rejections directly to Express error handling middleware.
 * ==========================================================
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
