const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const { getClientIp, getUserAgent } = require("../../utils/request");
const { COOKIE_NAMES, AUTH_MESSAGES } = require("./auth.constants");

const authService = require("./auth.service");

const {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require("./utils/cookie");

const {
  toProfileResponse,
  toUserResponse,
} = require("./auth.mapper");

/**
 * =====================================================
 * Auth Controller
 * =====================================================
 * Pure HTTP Request/Response handling layer for Authentication:
 * - Proxy-safe IP & User-Agent extraction
 * - Input Extraction & Service invocation
 * - Cookie Management (HTTP-only Refresh Token Cookies)
 * - ApiResponse Formatting & Error Delegation
 * =====================================================
 */

/**
 * Register Controller
 */
const register = asyncHandler(async (req, res) => {
  const result = await authService.register({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    ipAddress: getClientIp(req),
    userAgent: getUserAgent(req),
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      result.data,
      result.message
    )
  );
});

/**
 * Login Controller
 */
const login = asyncHandler(async (req, res) => {
  const result = await authService.login({
    email: req.body.email,
    password: req.body.password,
    ipAddress: getClientIp(req),
    userAgent: getUserAgent(req),
  });

  /**
   * Refresh Token Stored in HTTP Only Cookie
   */
  setRefreshTokenCookie(
    res,
    result.refreshToken
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken: result.accessToken,
        user: toProfileResponse(
          result.user
        ),
      },
      result.message
    )
  );
});

/**
 * Refresh Access Token Controller
 */
const refreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN] || req.body?.refreshToken;

  const result = await authService.refreshAccessToken(incomingRefreshToken);

  setRefreshTokenCookie(res, result.refreshToken);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken: result.accessToken,
        user: toUserResponse(result.user),
      },
      result.message
    )
  );
});

/**
 * Logout Current Device Controller
 */
const logout = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN] || req.body?.refreshToken;

  const result = await authService.logout({
    refreshToken: incomingRefreshToken,
    ipAddress: getClientIp(req),
    userAgent: getUserAgent(req),
  });

  clearRefreshTokenCookie(res);

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      result.message
    )
  );
});

/**
 * Logout All Devices Controller
 */
const logoutAllDevices = asyncHandler(async (req, res) => {
  const result = await authService.logoutAllDevices({
    userId: req.user.id,
    ipAddress: getClientIp(req),
    userAgent: getUserAgent(req),
  });

  clearRefreshTokenCookie(res);

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      result.message
    )
  );
});

/**
 * Forgot Password Controller
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword({
    email: req.body.email,
    ipAddress: getClientIp(req),
    userAgent: getUserAgent(req),
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      result.message
    )
  );
});

/**
 * Reset Password Controller
 */
const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword({
    token: req.body.token,
    newPassword: req.body.newPassword || req.body.password,
    ipAddress: getClientIp(req),
    userAgent: getUserAgent(req),
  });

  /**
   * Password reset invalidates all previous sessions
   */
  clearRefreshTokenCookie(res);

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      result.message
    )
  );
});

/**
 * Change Password Controller
 */
const changePassword = asyncHandler(async (req, res) => {
  const result = await authService.changePassword({
    userId: req.user.id,
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword,
    ipAddress: getClientIp(req),
    userAgent: getUserAgent(req),
  });

  /**
   * Force fresh login across devices
   */
  clearRefreshTokenCookie(res);

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      result.message
    )
  );
});

/**
 * Get Current User Profile Controller
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: toProfileResponse(req.user),
      },
      AUTH_MESSAGES.CURRENT_USER_FETCHED
    )
  );
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  logoutAllDevices,
  forgotPassword,
  resetPassword,
  changePassword,
  getCurrentUser,
};
