const express = require('express');
const candidateController = require('./candidate.controller');

const router = express.Router();

router.get('/', (req, res, next) => candidateController.getAll(req, res, next));

module.exports = router;
