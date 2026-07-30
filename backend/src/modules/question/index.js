const routes = require("./question.routes");
const service = require("./question.service");
const controller = require("./question.controller");
const repository = require("./question.repository");
const validator = require("./question.validator");
const dto = require("./question.dto");
const mapper = require("./question.mapper");
const constants = require("./question.constants");

/**
 * ==========================================================
 * Question Module Central Index Exporter
 * ==========================================================
 * Main export is Express Router so require("../modules/question") works directly.
 * Sub-properties attached to module exports.
 * ==========================================================
 */

module.exports = routes;

module.exports.routes = routes;
module.exports.service = service;
module.exports.controller = controller;
module.exports.repository = repository;
module.exports.validator = validator;
module.exports.dto = dto;
module.exports.mapper = mapper;
module.exports.constants = constants;
