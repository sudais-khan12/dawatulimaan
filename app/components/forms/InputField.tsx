import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InputFieldConfig } from "@/lib/forms/types";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

type InputFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  field: InputFieldConfig;
};

const InputField = <TFieldValues extends FieldValues>({
  control,
  field,
}: InputFieldProps<TFieldValues>) => {
  if (field.type === "checkbox") {
    return (
      <FormField
        control={control}
        name={field.id as FieldPath<TFieldValues>}
        render={({ field: controlField }) => (
          <FormItem className="flex flex-row items-start gap-3 rounded-md border bg-card px-4 py-3">
            <FormControl>
              <Checkbox
                checked={!!controlField.value}
                onCheckedChange={(value) => controlField.onChange(value === true)}
              />
            </FormControl>
            <div className="space-y-1 leading-tight">
              <FormLabel className="text-sm font-medium text-foreground">
                {field.label}
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    );
  }

  if (field.type === "select") {
    return (
      <FormField
        control={control}
        name={field.id as FieldPath<TFieldValues>}
        render={({ field: controlField }) => (
          <FormItem className="space-y-2">
            <FormLabel>{field.label}</FormLabel>
            <Select
              onValueChange={controlField.onChange}
              defaultValue={(controlField.value as string) ?? ""}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={control}
      name={field.id as FieldPath<TFieldValues>}
      render={({ field: controlField }) => (
        <FormItem className="space-y-2">
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <Input
              type={field.type === "email" ? "email" : "text"}
              placeholder={field.placeholder}
              {...controlField}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputField;
