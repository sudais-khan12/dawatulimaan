"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import ContentBlock from "@/app/components/forms/ContentBlock";
import InputField from "@/app/components/forms/InputField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  buildDefaultValues,
  buildFormSchema,
  isContentField,
} from "@/lib/forms/schema";
import type { FormFieldConfig } from "@/lib/forms/types";

type FormRendererProps = {
  fields: FormFieldConfig[];
  onSubmit?: (values: Record<string, unknown>) => void;
};

const FormRenderer = ({ fields, onSubmit }: FormRendererProps) => {
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

          if (field.type === "checkbox") {
            return (
              <InputField key={field.id} control={form.control} field={field} />
            );
          }

          if (field.type === "select") {
            return (
              <InputField key={field.id} control={form.control} field={field} />
            );
          }

          return (
            <InputField key={field.id} control={form.control} field={field} />
          );
        })}

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default FormRenderer;
