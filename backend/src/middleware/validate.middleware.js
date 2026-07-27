const ApiError = require("../utils/ApiError");

/**
 * ==========================================================
 * Zod Schema Validation Middleware Generator
 * ==========================================================
 * Parses req.body, req.query, req.params, and req.cookies
 * against provided Zod schema. Formats validation failures
 * into structured ApiError(400) responses.
 * ==========================================================
 */
const validate = (schema) => async (req, res, next) => {
  try {
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies,
    });

    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;

    return next();
  } catch (error) {
    if (
      error.name === "ZodError" ||
      (error.issues && Array.isArray(error.issues)) ||
      (error.errors && Array.isArray(error.errors))
    ) {
      const issues = error.issues || error.errors || [];
      const formattedErrors = issues.map((err) => ({
        field: err.path.length > 1 ? err.path.slice(1).join(".") : err.path.join("."),
        message: err.message,
      }));
      const firstErrorMessage = formattedErrors[0]?.message || "Validation Error";
      return next(new ApiError(400, firstErrorMessage, formattedErrors));
    }
    return next(error);
  }
};

module.exports = validate;
