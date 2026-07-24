const express = require('express');
const router = express.Router();

// Health Check Route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'HireQuest API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
