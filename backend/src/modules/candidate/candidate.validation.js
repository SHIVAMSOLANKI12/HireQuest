const { z } = require('zod');

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
});

module.exports = {
  updateProfileSchema,
};
