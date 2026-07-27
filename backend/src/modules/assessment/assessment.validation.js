const { z } = require('zod');

const createAssessmentSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  durationMinutes: z.number().positive(),
});

module.exports = {
  createAssessmentSchema,
};
