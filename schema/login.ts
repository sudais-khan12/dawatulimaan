import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  redirectTo: z.string().optional(),
});

export type LoginValues = z.infer<typeof loginSchema>;
