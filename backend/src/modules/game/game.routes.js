const express = require('express');
const gameController = require('./game.controller');

const router = express.Router();

router.get('/', (req, res, next) => gameController.getAll(req, res, next));

module.exports = router;
