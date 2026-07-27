const { z } = require('zod');

const submitGameScoreSchema = z.object({
  gameId: z.string(),
  score: z.number().min(0),
  timeTaken: z.number().min(0),
});

module.exports = {
  submitGameScoreSchema,
};
