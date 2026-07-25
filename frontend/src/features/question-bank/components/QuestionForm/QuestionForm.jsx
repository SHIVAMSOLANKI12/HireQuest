"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { questionSchema } from "../../validations/questionSchema";
import { defaultQuestion } from "../../constants/defaultQuestion";

const QuestionForm = ({
  defaultValues = defaultQuestion,
  onSubmit,
}) => {
  const form = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues,
  });

  const submitHandler = (data) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(submitHandler)}
      className="space-y-6"
    >
      {/* Form fields */}
    </form>
  );
};

export default QuestionForm;
