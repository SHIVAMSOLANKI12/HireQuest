const express = require("express");

const router = express.Router();

/**
 * Health Check
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;