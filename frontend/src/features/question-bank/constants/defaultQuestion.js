import { GAME_STATUS, DIFFICULTY } from "@/constants";

export const defaultQuestion = {
  question: "",
  category: "",
  difficulty: DIFFICULTY.EASY,
  status: GAME_STATUS.ACTIVE,
  type: "MCQ",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctAnswer: "",
};
