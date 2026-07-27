const { z } = require('zod');

const queryResultSchema = z.object({
  candidateId: z.string().optional(),
  assessmentId: z.string().optional(),
});

module.exports = {
  queryResultSchema,
};
