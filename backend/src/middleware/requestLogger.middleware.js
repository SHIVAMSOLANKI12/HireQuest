const pinoHttp = require("pino-http");
const logger = require("../config/logger");

const requestLogger = pinoHttp({
  logger,

  customLogLevel(req, res, error) {
    if (error || res.statusCode >= 500) return "error";

    if (res.statusCode >= 400) return "warn";

    return "info";
  },

  customSuccessMessage(req, res) {
    return `${req.method} ${req.url} completed with ${res.statusCode}`;
  },

  customErrorMessage(req, res) {
    return `${req.method} ${req.url} failed with ${res.statusCode}`;
  },

  serializers: {
    req(req) {
      return {
        id: req.requestId,
        method: req.method,
        url: req.url,
      };
    }
  }
});

module.exports = requestLogger;