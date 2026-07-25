"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIFFICULTY_OPTIONS, GAME_STATUS_OPTIONS } from "@/constants";
import { questionSchema } from "../../validations/questionSchema";
import { defaultQuestion } from "../../constants/defaultQuestion";
import QuestionOptionFields from "./QuestionOptionFields";

const QuestionForm = ({
  defaultValues = defaultQuestion,
  onSubmit,
  onCancel,
}) => {
  const form = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues,
  });

  const submitHandler = (data) => {
    onSubmit(data);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="space-y-6"
      >
        {/* Question Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Question</label>
          <Input
            {...form.register("question")}
            placeholder="Enter question"
          />
          {form.formState.errors.question && (
            <p className="text-xs text-destructive">
              {form.formState.errors.question.message}
            </p>
          )}
        </div>

        {/* Category & Difficulty */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Input
              {...form.register("category")}
              placeholder="e.g. JavaScript"
            />
            {form.formState.errors.category && (
              <p className="text-xs text-destructive">
                {form.formState.errors.category.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <Select
              value={form.watch("difficulty")}
              onValueChange={(val) => form.setValue("difficulty", val, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_OPTIONS.filter(opt => opt.value !== "all").map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.difficulty && (
              <p className="text-xs text-destructive">
                {form.formState.errors.difficulty.message}
              </p>
            )}
          </div>
        </div>

        {/* Status & Correct Answer */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={form.watch("status")}
              onValueChange={(val) => form.setValue("status", val, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {GAME_STATUS_OPTIONS.filter(opt => opt.value !== "all").map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.status && (
              <p className="text-xs text-destructive">
                {form.formState.errors.status.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Correct Answer</label>
            <Select
              value={form.watch("correctAnswer")}
              onValueChange={(val) => form.setValue("correctAnswer", val, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select correct option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="optionA">Option A</SelectItem>
                <SelectItem value="optionB">Option B</SelectItem>
                <SelectItem value="optionC">Option C</SelectItem>
                <SelectItem value="optionD">Option D</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.correctAnswer && (
              <p className="text-xs text-destructive">
                {form.formState.errors.correctAnswer.message}
              </p>
            )}
          </div>
        </div>

        {/* Options grid */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Options</label>
          <QuestionOptionFields />
        </div>

        {/* Form buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            Save Question
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default QuestionForm;
