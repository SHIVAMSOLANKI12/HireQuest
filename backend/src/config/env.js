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
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  cookie: {
    secret: process.env.COOKIE_SECRET,
  },

  cors: {
    origin: process.env.CLIENT_URL,
  },

  logger: {
    level: process.env.LOG_LEVEL || "info",
  },
});

module.exports = env;