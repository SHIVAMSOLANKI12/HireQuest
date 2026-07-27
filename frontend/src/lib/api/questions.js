// Keep an in-memory mutable copy of the questions list for mock simulation
let questions = [
  {
    id: 1,
    question: "What is JavaScript?",
    category: "JavaScript",
    difficulty: "Easy",
    type: "MCQ",
    status: "Active",
    options: [
      {
        id: "optionA",
        text: "Programming Language",
      },
      {
        id: "optionB",
        text: "Database",
      },
      {
        id: "optionC",
        text: "Browser",
      },
      {
        id: "optionD",
        text: "Operating System",
      },
    ],
    correctAnswer: "optionA",
    usedIn: 8,
    updatedAt: "2026-07-27T08:30:00.000Z",
  },
  {
    id: 2,
    question: "Which method creates a new array?",
    category: "JavaScript",
    difficulty: "Medium",
    type: "MCQ",
    status: "Draft",
    options: [
      {
        id: "optionA",
        text: "concat()",
      },
      {
        id: "optionB",
        text: "map()",
      },
      {
        id: "optionC",
        text: "push()",
      },
      {
        id: "optionD",
        text: "pop()",
      },
    ],
    correctAnswer: "optionB",
    usedIn: 3,
    updatedAt: "2026-07-27T00:00:00.000Z",
  },
];

// Helper to simulate API response latency
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const getQuestions = async () => {
  await delay(300);
  return {
    success: true,
    data: questions,
  };
};

export const getQuestionById = async (id) => {
  await delay(200);
  const question = questions.find(
    (q) => q.id === id || q.id === Number(id)
  );

  if (!question) {
    throw new Error("Question not found");
  }

  return {
    success: true,
    data: question,
  };
};

export const createQuestion = async (payload) => {
  await delay(400);

  const newQuestion = {
    id: Date.now(),
    ...payload,
    usedIn: 0,
    updatedAt: new Date().toISOString(),
  };

  questions = [newQuestion, ...questions];

  return {
    success: true,
    data: newQuestion,
  };
};

export const updateQuestion = async (id, payload) => {
  await delay(400);
  const index = questions.findIndex(
    (question) => question.id === id || question.id === Number(id)
  );

  if (index === -1) {
    throw new Error("Question not found");
  }

  const existingQuestion = questions[index];
  const updatedQuestion = {
    ...existingQuestion,
    ...payload,
    id: existingQuestion.id,
    usedIn: existingQuestion.usedIn,
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
