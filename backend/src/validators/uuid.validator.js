const { z } = require("zod");

const uuidValidator = z.string().cuid();

module.exports = uuidValidator;
