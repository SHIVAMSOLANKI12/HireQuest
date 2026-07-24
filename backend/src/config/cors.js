const env = require("./env");

const corsOptions = {
  origin: env.cors.origin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = corsOptions;