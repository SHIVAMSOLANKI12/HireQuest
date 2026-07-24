const pino = require("pino");
const env = require("./env");

const logger = pino({
  level: env.logger.level,
  transport:
    env.nodeEnv === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
          },
        }
      : undefined,
});

module.exports = logger;