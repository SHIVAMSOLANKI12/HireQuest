const app = require("./app");
const env = require("./config/env");
const logger = require("./config/logger");

const server = app.listen(env.port, () => {
  logger.info(
    `${env.app.name} server is running on port ${env.port}`
  );
});

/**
 * Graceful Shutdown
 */
const shutdown = (signal) => {
  logger.info(`${signal} received. Shutting down server...`);

  server.close(() => {
    logger.info("Server closed successfully.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));