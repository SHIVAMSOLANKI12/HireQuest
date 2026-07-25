import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";

const QuestionOptionFields = () => {
  const { register, formState: { errors } } = useFormContext();

  const options = [
    { key: "optionA", label: "Option A" },
    { key: "optionB", label: "Option B" },
    { key: "optionC", label: "Option C" },
    { key: "optionD", label: "Option D" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {options.map((option) => (
        <div key={option.key} className="space-y-1">
          <Input
            {...register(option.key)}
            placeholder={option.label}
          />
          {errors[option.key] && (
            <p className="text-xs text-destructive">
              {errors[option.key].message}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionOptionFields;
