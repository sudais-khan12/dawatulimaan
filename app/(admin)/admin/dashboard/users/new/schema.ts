import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.literal("admin"),
});

export type CreateUserValues = z.infer<typeof createUserSchema>;
