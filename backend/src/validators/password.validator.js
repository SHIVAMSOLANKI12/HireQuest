const { z } = require("zod");

const passwordValidator = z
  .string({
    required_error: "Password is required.",
  })
  .min(8, "Password must be at least 8 characters long.")
  .max(64, "Password cannot exceed 64 characters.")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&^()_\-+=])[A-Za-z\d@$!%*?#&^()_\-+=]{8,64}$/,
    "Password must contain uppercase, lowercase, number and special character."
  );

module.exports = passwordValidator;
