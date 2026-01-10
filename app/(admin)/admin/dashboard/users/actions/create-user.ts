"use server";

import { createUser } from "@/lib/persistence/users";
import { getSessionFromCookies } from "@/lib/auth/session";
import {
  createUserSchema,
  type CreateUserValues,
} from "@/app/(admin)/admin/dashboard/users/new/schema";

export const createUserAction = async (values: unknown) => {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const parsed = createUserSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const payload: CreateUserValues = parsed.data;
  const result = await createUser(payload);

  if (result.error) {
    if (typeof (result.error as any).code === "string") {
      const code = (result.error as any).code;
      if (code === "23505" || code === "409") {
        throw new Error("Email already exists.");
      }
    }
    throw result.error;
  }

  return result.data;
};
