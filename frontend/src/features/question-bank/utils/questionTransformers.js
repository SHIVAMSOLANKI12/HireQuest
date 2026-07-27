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

export const transformQuestionToForm = (question) => {
  if (!question) return null;

  const getOptionText = (id) => {
    return (
      question.options?.find(
        (option) => option.id === id
      )?.text || ""
    );
  };

  return {
    question: question.question || "",
    category: question.category || "",
    difficulty: question.difficulty || "Easy",
    type: question.type || "MCQ",
    status: question.status || "Active",

    optionA: getOptionText("optionA"),
    optionB: getOptionText("optionB"),
    optionC: getOptionText("optionC"),
    optionD: getOptionText("optionD"),

    correctAnswer: question.correctAnswer || "",
  };
};
