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
    id: questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1,
    ...formattedData,
    usedIn: 0,
    updatedAt: new Date().toISOString(),
  };
  questions.push(newQuestion);
  return {
    success: true,
    data: newQuestion,
  };
};

export const updateQuestion = async (id, questionData) => {
  await delay(400);
  const index = questions.findIndex((q) => q.id === Number(id) || q.id === id);
  if (index !== -1) {
    const formattedData = formatQuestionData(questionData);
    questions[index] = {
      ...questions[index],
      ...formattedData,
      updatedAt: new Date().toISOString(),
    };
    return {
      success: true,
      data: questions[index],
    };
  }
  return {
    success: false,
    error: "Question not found",
  };
};

export const deleteQuestion = async (id) => {
  await delay(400);
  const originalLength = questions.length;
  questions = questions.filter((q) => q.id !== Number(id) && q.id !== id);
  
  if (questions.length < originalLength) {
    return {
      success: true,
      data: id,
    };
  }
  return {
    success: false,
    error: "Question not found",
  };
};
