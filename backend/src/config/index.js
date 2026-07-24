// Central configuration exporter
const env = require('./env');
const prisma = require('./database');
const logger = require('./logger');

module.exports = {
  env,
  prisma,
  logger,
};
