"use server";

import { createUser } from "@/lib/persistence/users";
import { getRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import {
  createUserSchema,
  type CreateUserValues,
} from "@/app/(admin)/admin/dashboard/users/new/schema";

export const createUserAction = async (values: unknown) => {
  const supabase = await getRouteHandlerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const parsed = createUserSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const payload: CreateUserValues = parsed.data;
  const result = await createUser(payload);

  if (result.error) {
    if (
      typeof result.error === "object" &&
      result.error !== null &&
      "code" in result.error &&
      typeof result.error.code === "string"
    ) {
      const code = result.error.code;
      if (code === "23505" || code === "409") {
        throw new Error("Email already exists.");
      }
    }
    throw result.error;
  }

  return result.data;
};
