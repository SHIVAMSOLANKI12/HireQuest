const { z } = require("zod");

const emailValidator = z
  .string({
    required_error: "Email is required.",
  })
  .trim()
  .email("Invalid email address.")
  .max(255);

module.exports = emailValidator;
