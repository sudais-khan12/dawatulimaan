import { z } from "zod";

export const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().optional(),
  type: z.enum(["virtual", "in-person"]),
  description: z.string().optional(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
