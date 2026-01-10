"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Form } from "@/components/ui/form";
import {
  buildDefaultValues,
  buildFormSchema,
  isContentField,
} from "@/lib/forms/schema";
import type { FormFieldConfig } from "@/lib/forms/types";
import ContentBlock from "./Forms/ContentBlock";
import InputField from "./Forms/InputField";

type FormRendererProps = {
  fields: FormFieldConfig[];
  onSubmit?: (values: Record<string, unknown>) => void;
  disabled?: boolean;
};

const FormRenderer = ({ fields, onSubmit, disabled }: FormRendererProps) => {
  const formSchema = useMemo(() => buildFormSchema(fields), [fields]);
  type FormValues = z.infer<typeof formSchema>;

  const defaultValues = useMemo(() => buildDefaultValues(fields), [fields]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues as FormValues,
  });

  const handleFormSubmit = form.handleSubmit((values) => {
    onSubmit?.(values);
    console.log("Form submitted", values);
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={handleFormSubmit} noValidate>
        {fields.map((field) => {
          if (isContentField(field)) {
            return <ContentBlock key={field.id} field={field} />;
          }

          return (
            <InputField
              key={field.id}
              control={form.control}
              field={field}
              disabled={disabled || form.formState.isSubmitting}
            />
          );
        })}

        <Button
          type="submit"
          className="w-full"
          disabled={disabled || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner className="h-4 w-4" />
              <span>Submitting</span>
            </span>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default FormRenderer;
