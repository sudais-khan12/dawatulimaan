"use server";
import { loginSchema, type LoginValues } from "@/schema/login";
import { redirect } from "next/navigation";

export const loginAction = async (values: unknown) => {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error("Invalid email");
  }

  const { redirectTo } = parsed.data as LoginValues;

  // In the current magic-link model, the loginAction should not be used.
  // Preserve a no-op that simply redirects.

  redirect(redirectTo || "/admin/login");
};
