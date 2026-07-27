const dotenv = require("dotenv");

dotenv.config();

const requiredEnvVariables = [
  "NODE_ENV",
  "PORT",
  "DATABASE_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "CLIENT_URL",
];

requiredEnvVariables.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV,
  port: Number(process.env.PORT),

  app: {
    name: process.env.APP_NAME || "HireQuest",
    url: process.env.APP_URL || `http://localhost:${process.env.PORT}`,
    environment: process.env.NODE_ENV,
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    refreshTokenTTL: Number(process.env.REFRESH_TOKEN_TTL_MS) || 7 * 24 * 60 * 60 * 1000,
  },

  cookie: {
    secret: process.env.COOKIE_SECRET,
    accessMaxAge: Number(process.env.ACCESS_COOKIE_MAX_AGE) || 15 * 60 * 1000,
    refreshMaxAge: Number(process.env.REFRESH_COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
  },

  auth: {
    requireEmailVerification: process.env.REQUIRE_EMAIL_VERIFICATION === "true",
  },

  security: {
    bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
  },

  cors: {
    origin: process.env.CLIENT_URL,
  },

  logger: {
    level: process.env.LOG_LEVEL || "info",
  },
});

module.exports = env;