const express = require("express");
const authRoutes = require("../modules/auth/auth.routes");
const assessmentRoutes = require("../modules/assessment/assessment.routes");

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

/**
 * Auth Module Routes (/api/v1/auth)
 */
router.use("/auth", authRoutes);

/**
 * Assessment Module Routes (/api/v1/assessments)
 */
router.use("/assessments", assessmentRoutes);

module.exports = router;