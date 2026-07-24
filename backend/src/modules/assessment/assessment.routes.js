const express = require('express');
const assessmentController = require('./assessment.controller');

const router = express.Router();

router.get('/', (req, res, next) => assessmentController.getAll(req, res, next));
router.post('/', (req, res, next) => assessmentController.create(req, res, next));

module.exports = router;
