const env = require("../../../config/env");
const { COOKIE_NAMES } = require("../auth.constants");

/**
 * ============================================================
 * Cookie Utility
 * ============================================================
 * Handles:
 * - Access Token Cookie
 * - Refresh Token Cookie
 * - Clear Cookies
 * ============================================================
 */

const isProduction = env.app.environment === "production";

const DEFAULT_COOKIE_OPTIONS = Object.freeze({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
});

/**
 * Build Access Token Cookie Options
 *
 * @returns {import("express").CookieOptions}
 */
const getAccessTokenCookieOptions = () => ({
  ...DEFAULT_COOKIE_OPTIONS,
  maxAge: env.cookie.accessMaxAge,
});

/**
 * Build Refresh Token Cookie Options
 *
 * @returns {import("express").CookieOptions}
 */
const getRefreshTokenCookieOptions = () => ({
  ...DEFAULT_COOKIE_OPTIONS,
  maxAge: env.cookie.refreshMaxAge,
});

/**
 * Set Refresh Token Cookie
 *
 * @param {import("express").Response} res
 * @param {string} refreshToken
 */
const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie(
    COOKIE_NAMES.REFRESH_TOKEN,
    refreshToken,
    getRefreshTokenCookieOptions()
  );
};

/**
 * Set Access Token Cookie
 * (Optional - if you decide to use cookies for access token)
 *
 * @param {import("express").Response} res
 * @param {string} accessToken
 */
const setAccessTokenCookie = (res, accessToken) => {
  res.cookie(
    COOKIE_NAMES.ACCESS_TOKEN,
    accessToken,
    getAccessTokenCookieOptions()
  );
};

/**
 * Clear Refresh Token Cookie
 *
 * @param {import("express").Response} res
 */
const clearRefreshTokenCookie = (res) => {
  res.clearCookie(
    COOKIE_NAMES.REFRESH_TOKEN,
    DEFAULT_COOKIE_OPTIONS
  );
};

/**
 * Clear Access Token Cookie
 *
 * @param {import("express").Response} res
 */
const clearAccessTokenCookie = (res) => {
  res.clearCookie(
    COOKIE_NAMES.ACCESS_TOKEN,
    DEFAULT_COOKIE_OPTIONS
  );
};

module.exports = {
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,

  setAccessTokenCookie,
  setRefreshTokenCookie,

  clearAccessTokenCookie,
  clearRefreshTokenCookie,
};
