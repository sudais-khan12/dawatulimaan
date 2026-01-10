import { z } from "zod";

import type {
  ContentFieldConfig,
  FormFieldConfig,
  InputFieldConfig,
} from "./types";

export const isInputField = (
  field: FormFieldConfig,
): field is InputFieldConfig => {
  return (
    field.type === "text" ||
    field.type === "email" ||
    field.type === "select" ||
    field.type === "checkbox"
  );
};

export const isContentField = (
  field: FormFieldConfig,
): field is ContentFieldConfig => {
  return (
    field.type === "heading" ||
    field.type === "notice" ||
    field.type === "instructions"
  );
};

export const buildFormSchema = (fields: FormFieldConfig[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    if (!isInputField(field)) return;

    if (field.type === "checkbox") {
      const checkboxSchema = z.boolean();
      shape[field.id] = field.required
        ? checkboxSchema.refine((value) => value, {
            message: `${field.label} is required`,
          })
        : checkboxSchema.default(false);
      return;
    }

    if (field.type === "email") {
      const base = z.string().email("Enter a valid email");
      shape[field.id] = field.required
        ? base.min(1, `${field.label} is required`)
        : base.optional().or(z.literal(""));
      return;
    }

    const base = z.string();
    shape[field.id] = field.required
      ? base.min(1, `${field.label} is required`)
      : base.optional().or(z.literal(""));
  });

  return z.object(shape);
};

export const buildDefaultValues = (fields: FormFieldConfig[]) => {
  const values: Record<string, unknown> = {};

  fields.forEach((field) => {
    if (!isInputField(field)) return;
    values[field.id] = field.type === "checkbox" ? false : "";
  });

  return values;
};
