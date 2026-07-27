export const transformQuestionFormToPayload = (data) => {
  return {
    question: data.question.trim(),
    category: data.category.trim(),
    difficulty: data.difficulty,
    type: data.type,
    status: data.status,

    options: [
      {
        id: "optionA",
        text: data.optionA.trim(),
      },
      {
        id: "optionB",
        text: data.optionB.trim(),
      },
      {
        id: "optionC",
        text: data.optionC.trim(),
      },
      {
        id: "optionD",
        text: data.optionD.trim(),
      },
    ],

    correctAnswer: data.correctAnswer,
  };
};
