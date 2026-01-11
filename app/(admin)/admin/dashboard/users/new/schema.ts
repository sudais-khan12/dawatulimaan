import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export type CreateUserValues = z.infer<typeof createUserSchema>;
