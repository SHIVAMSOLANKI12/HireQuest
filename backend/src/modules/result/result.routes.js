const express = require('express');
const resultController = require('./result.controller');

const router = express.Router();

router.get('/', (req, res, next) => resultController.getAll(req, res, next));

module.exports = router;
