const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const env = require("../../../config/env");
const ApiError = require("../../../utils/ApiError");

const {
  TOKEN_TYPES,
  AUTH_ERRORS,
} = require("../auth.constants");

/**
 * ==========================================================
 * Enterprise JWT Utility (v3 - Token Versioning Enabled)
 * ==========================================================
 */

const JWT_OPTIONS = Object.freeze({
  issuer: env.app.name,
  audience: env.app.url,
});

/**
 * Build Access Token Payload
 */
const buildAccessPayload = (user) => ({
  sub: user.id,
  email: user.email,
  role: user.role,
  tokenVersion: user.tokenVersion ?? 0,
  type: TOKEN_TYPES.ACCESS,
});

/**
 * Build Refresh Token Payload
 */
const buildRefreshPayload = (user) => ({
  sub: user.id,
  tokenVersion: user.tokenVersion ?? 0,
  type: TOKEN_TYPES.REFRESH,
});

/**
 * Sign JWT
 */
const signToken = ({
  payload,
  secret,
  expiresIn,
}) => {
  return jwt.sign(payload, secret, {
    expiresIn,
    issuer: JWT_OPTIONS.issuer,
    audience: JWT_OPTIONS.audience,
    jwtid: crypto.randomUUID(),
  });
};

/**
 * Generate Access Token
 */
const generateAccessToken = (user) =>
  signToken({
    payload: buildAccessPayload(user),
    secret: env.jwt.accessSecret,
    expiresIn: env.jwt.accessExpiresIn,
  });

/**
 * Generate Refresh Token
 */
const generateRefreshToken = (user) =>
  signToken({
    payload: buildRefreshPayload(user),
    secret: env.jwt.refreshSecret,
    expiresIn: env.jwt.refreshExpiresIn,
  });

/**
 * Verify Token
 */
const verifyToken = ({
  token,
  secret,
  expectedType,
}) => {
  try {
    const payload = jwt.verify(token, secret, {
      issuer: JWT_OPTIONS.issuer,
      audience: JWT_OPTIONS.audience,
    });

    if (payload.type !== expectedType) {
      throw new ApiError(
        401,
        AUTH_ERRORS.INVALID_TOKEN
      );
    }

    return payload;
  } catch (error) {
    switch (error.name) {
      case "TokenExpiredError":
        throw new ApiError(
          401,
          AUTH_ERRORS.TOKEN_EXPIRED
        );

      case "JsonWebTokenError":
        throw new ApiError(
          401,
          AUTH_ERRORS.INVALID_TOKEN
        );

      case "NotBeforeError":
        throw new ApiError(
          401,
          AUTH_ERRORS.INVALID_TOKEN
        );

      default:
        throw error;
    }
  }
};

/**
 * Verify Access Token
 */
const verifyAccessToken = (token) =>
  verifyToken({
    token,
    secret: env.jwt.accessSecret,
    expectedType: TOKEN_TYPES.ACCESS,
  });

/**
 * Verify Refresh Token
 */
const verifyRefreshToken = (token) =>
  verifyToken({
    token,
    secret: env.jwt.refreshSecret,
    expectedType: TOKEN_TYPES.REFRESH,
  });

/**
 * Decode Token
 *
 * Debugging only.
 */
const decodeToken = (token) => jwt.decode(token);

/**
 * Generate Token Id
 */
const generateTokenId = () =>
  crypto.randomUUID();

module.exports = {
  generateAccessToken,
  generateRefreshToken,

  verifyAccessToken,
  verifyRefreshToken,

  decodeToken,

  generateTokenId,
};
