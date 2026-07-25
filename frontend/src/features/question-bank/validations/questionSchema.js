import { z } from "zod";

export const questionSchema = z.object({
  question: z
    .string()
    .min(10, "Question must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  difficulty: z.string().min(1),
  status: z.string().min(1),
  type: z.string().min(1),
  optionA: z.string().min(1),
  optionB: z.string().min(1),
  optionC: z.string().min(1),
  optionD: z.string().min(1),
  correctAnswer: z.string().min(1),
});
