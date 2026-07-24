const { z } = require('zod');

const submitQuizSchema = z.object({
  quizId: z.string(),
  answers: z.array(z.object({
    questionId: z.string(),
    selectedOption: z.number(),
  })),
});

module.exports = {
  submitQuizSchema,
};
