const routes = require("./assessment.routes");
const service = require("./assessment.service");
const controller = require("./assessment.controller");
const repository = require("./assessment.repository");
const validator = require("./assessment.validator");
const mapper = require("./assessment.mapper");
const constants = require("./assessment.constants");

/**
 * ==========================================================
 * Assessment Module Central Index Exporter
 * ==========================================================
 * Main export is Express Router so require("../modules/assessment") works directly.
 * Sub-properties (service, controller, repository, etc.) attached to exports.
 * ==========================================================
 */

module.exports = routes;

module.exports.routes = routes;
module.exports.service = service;
module.exports.controller = controller;
module.exports.repository = repository;
module.exports.validator = validator;
module.exports.mapper = mapper;
module.exports.constants = constants;
