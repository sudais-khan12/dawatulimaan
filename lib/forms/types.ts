export type FormFieldOption = {
  label: string;
  value: string;
};

export type InputFieldType = "text" | "email" | "select" | "checkbox";

export type ContentFieldType = "heading" | "notice" | "instructions";

export type InputFieldConfig = {
  id: string;
  type: InputFieldType;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
};

export type ContentFieldConfig = {
  id: string;
  type: ContentFieldType;
  content: string;
};

export type FormFieldConfig = InputFieldConfig | ContentFieldConfig;
