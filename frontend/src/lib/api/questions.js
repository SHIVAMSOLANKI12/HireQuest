import { questions as initialQuestions } from "@/features/question-bank/data";

// Keep an in-memory mutable copy of the questions list for mock simulation
let questions = [...initialQuestions];

// Helper to simulate API response latency
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// Format data from flat UI form values to nested structured database representation
const formatQuestionData = (questionData) => {
  let formattedOptions = questionData.options;
  
  // Transform optionA, optionB, optionC, optionD flat fields to structured array
  if (!formattedOptions && questionData.optionA) {
    formattedOptions = [
      { id: "optionA", text: questionData.optionA },
      { id: "optionB", text: questionData.optionB },
      { id: "optionC", text: questionData.optionC },
      { id: "optionD", text: questionData.optionD },
    ];
  }

  // Clean flat fields from output record to keep DB normalized
  const { optionA, optionB, optionC, optionD, ...cleanData } = questionData;

  return {
    ...cleanData,
    options: formattedOptions || [],
  };
};

export const getQuestions = async () => {
  await delay(300);
  return {
    success: true,
    data: questions,
  };
};

export const getQuestionById = async (id) => {
  await delay(200);
  const question = questions.find((q) => q.id === Number(id) || q.id === id);
  return {
    success: true,
    data: question || null,
  };
};

export const createQuestion = async (questionData) => {
  await delay(400);
  const formattedData = formatQuestionData(questionData);
  const newQuestion = {
    id: Date.now(),
    ...formattedData,
    usedIn: 0,
    updatedAt: new Date().toISOString(),
  };
  questions = [newQuestion, ...questions];
  return {
    success: true,
    data: newQuestion,
  };
};

export const updateQuestion = async (id, questionData) => {
  await delay(400);
  const index = questions.findIndex(
    (question) => question.id === id || question.id === Number(id)
  );

  if (index === -1) {
    return {
      success: false,
      error: "Question not found",
    };
  }

  const formattedData = formatQuestionData(questionData);
  const updatedQuestion = {
    ...questions[index],
    ...formattedData,
    id: questions[index].id,
    usedIn: questions[index].usedIn,
    updatedAt: new Date().toISOString(),
  };

  questions[index] = updatedQuestion;

  return {
    success: true,
    data: updatedQuestion,
  };
};

export const deleteQuestion = async (id) => {
  await delay(400);

  const exists = questions.some(
    (question) => question.id === id || question.id === Number(id)
  );

  if (!exists) {
    throw new Error("Question not found");
  }

  questions = questions.filter(
    (question) => question.id !== id && question.id !== Number(id)
  );

  return {
    success: true,
    data: id,
  };
};
