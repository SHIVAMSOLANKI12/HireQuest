const express = require('express');

const authRoutes = require('../modules/auth/auth.routes');
const assessmentRoutes = require('../modules/assessment/assessment.routes');
const candidateRoutes = require('../modules/candidate/candidate.routes');
const gameRoutes = require('../modules/game/game.routes');
const quizRoutes = require('../modules/quiz/quiz.routes');
const resultRoutes = require('../modules/result/result.routes');

const router = express.Router();

// Health Check Route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'HireQuest API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Feature Module Routes
router.use('/auth', authRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/candidates', candidateRoutes);
router.use('/games', gameRoutes);
router.use('/quizzes', quizRoutes);
router.use('/results', resultRoutes);

module.exports = router;
