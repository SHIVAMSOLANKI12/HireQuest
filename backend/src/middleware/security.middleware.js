const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const hpp = require("hpp");
const express = require("express");

const securityMiddleware = (app) => {
  /**
   * Security Headers
   */
  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: "cross-origin",
      },
    })
  );

  /**
   * Prevent HTTP Parameter Pollution
   */
  app.use(hpp());

  /**
   * Compress Response
   */
  app.use(compression());

  /**
   * Parse JSON Body
   */
  app.use(
    express.json({
      limit: "10kb",
    })
  );

  /**
   * Parse URL Encoded Body
   */
  app.use(
    express.urlencoded({
      extended: true,
      limit: "10kb",
    })
  );

  /**
   * Parse Cookies
   */
  app.use(cookieParser());
};

module.exports = securityMiddleware;