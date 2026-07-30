const ApiError = require("../utils/ApiError");

/**
 * ==========================================================
 * Zod Schema Validation Middleware Generator
 * ==========================================================
 * Parses req.body, req.query, req.params against Zod schema.
 * Supports both wrapped ({ body, query, params }) and direct body schemas.
 * ==========================================================
 */
const validate = (schema) => async (req, res, next) => {
  try {
    let targetSchema = schema;
    while (targetSchema._def && targetSchema._def.schema) {
      targetSchema = targetSchema._def.schema;
    }

    const shape = targetSchema.shape || {};
    const isWrappedSchema = Boolean(shape.body || shape.query || shape.params);

    const dataToParse = isWrappedSchema
      ? {
          body: req.body,
          query: req.query,
          params: req.params,
          cookies: req.cookies,
        }
      : req.body;

    const parsed = await schema.parseAsync(dataToParse);

    if (isWrappedSchema) {
      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.params) req.params = parsed.params;
      req.validatedData = parsed.body || parsed.query || parsed.params || parsed;
    } else {
      req.body = parsed;
      req.validatedData = parsed;
    }

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
