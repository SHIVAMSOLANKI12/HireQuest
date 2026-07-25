import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const QuestionOptionFields = () => {
  const { control } = useFormContext();

  const options = [
    { key: "optionA", label: "Option A" },
    { key: "optionB", label: "Option B" },
    { key: "optionC", label: "Option C" },
    { key: "optionD", label: "Option D" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {options.map((option) => (
        <FormField
          key={option.key}
          control={control}
          name={option.key}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder={option.label} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};

export default QuestionOptionFields;
