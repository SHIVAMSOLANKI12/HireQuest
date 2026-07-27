const { register } = require("./services/register.service");
const { login } = require("./services/login.service");
const { refreshAccessToken } = require("./services/refresh-token.service");
const { logout, logoutAllDevices } = require("./services/logout.service");
const { changePassword } = require("./services/change-password.service");
const { forgotPassword } = require("./services/forgot-password.service");
const { resetPassword } = require("./services/reset-password.service");

/**
 * ==========================================================
 * Auth Service Aggregator Facade
 * ==========================================================
 * Centralized entry point re-exporting modular authentication services.
 * ==========================================================
 */

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  logoutAllDevices,
  changePassword,
  forgotPassword,
  resetPassword,
};
