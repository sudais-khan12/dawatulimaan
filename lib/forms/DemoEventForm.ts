import type { FormFieldConfig } from "./types";

export const demoEventFormFields: FormFieldConfig[] = [
  {
    id: "heading",
    type: "heading",
    content: "Quick Registration",
  },
  {
    id: "fullName",
    type: "text",
    label: "Full name",
    required: true,
    placeholder: "Aisha Khan",
  },
  {
    id: "email",
    type: "email",
    label: "Email",
    required: true,
    placeholder: "you@example.com",
  },
  {
    id: "attendance",
    type: "select",
    label: "Attendance type",
    required: true,
    options: [
      { label: "In-person", value: "in_person" },
      { label: "Virtual", value: "virtual" },
      { label: "Undecided", value: "undecided" },
    ],
  },
  {
    id: "volunteer",
    type: "checkbox",
    label: "I can volunteer on the day of the event",
    required: false,
  },
];
