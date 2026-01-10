import { z } from "zod";

export const personSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
});

export type Person = z.infer<typeof personSchema>;
