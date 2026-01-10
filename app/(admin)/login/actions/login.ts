"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

import { authenticateUser } from "@/lib/persistence/users";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password is required"),
  redirectTo: z.string().optional(),
});

export const loginAction = async (values: unknown) => {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error("Invalid credentials");
  }

  const { email, password, redirectTo } = parsed.data;
  const result = await authenticateUser(email, password);

  if (result.error || !result.data) {
    throw new Error(result.error?.message ?? "Invalid credentials");
  }

  const token = createSessionToken(result.data.id, result.data.role);
  await setSessionCookie(token);

  redirect(redirectTo || "/admin/dashboard");
};
