const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const corsOptions = require("./config/cors");
const routes = require("./routes");

const app = express();

/**
 * Security
 */
app.use(helmet());

/**
 * CORS
 */
app.use(cors(corsOptions));

/**
 * Compression
 */
app.use(compression());

/**
 * Body Parser
 */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

/**
 * Cookie Parser
 */
app.use(cookieParser());

/**
 * Routes
 */
app.use("/api/v1", routes);

/**
 * 404 Handler (Temporary)
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;