/**
 * ==========================================================
 * Standardized Success Response Helper
 * ==========================================================
 * Standardizes successful HTTP responses across all modules.
 * ==========================================================
 */

class SuccessResponse {
  constructor({
    message = "Request completed successfully.",
    data = null,
    meta = null,
  } = {}) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  static send(res, options = {}, statusCode = 200) {
    const response = new SuccessResponse(options);
    return res.status(statusCode).json(response);
  }
}

module.exports = SuccessResponse;
