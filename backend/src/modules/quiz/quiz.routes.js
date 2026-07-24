const express = require('express');
const quizController = require('./quiz.controller');

const router = express.Router();

router.get('/', (req, res, next) => quizController.getAll(req, res, next));

module.exports = router;
