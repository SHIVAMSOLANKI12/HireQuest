const express = require("express");
const authRoutes = require("../modules/auth/auth.routes");
const assessmentRoutes = require("../modules/assessment/assessment.routes");
const questionRoutes = require("../modules/question");
const categoryRoutes = require("../modules/category");
const tagRoutes = require("../modules/tag");

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

/**
 * Question Module Routes (/api/v1/questions)
 */
router.use("/questions", questionRoutes);

/**
 * Question Category Module Routes (/api/v1/question-categories)
 */
router.use("/question-categories", categoryRoutes);

/**
 * Question Tag Module Routes (/api/v1/question-tags)
 */
router.use("/question-tags", tagRoutes);

module.exports = router;