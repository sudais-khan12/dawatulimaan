"use server";

import { eventFormSchema } from "@/app/(admin)/admin/dashboard/events/new/schema";
import { createEvent } from "@/lib/persistence/events";

export const createEventAction = async (values: unknown) => {
  const parsed = eventFormSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error("Invalid event data");
  }

  const result = await createEvent(parsed.data);

  if (result.error) {
    if (typeof (result.error as any).code === "string") {
      const code = (result.error as any).code;
      if (code === "23505" || code === "409") {
        throw new Error("Slug already exists. Please choose another.");
      }
    }
    throw result.error;
  }

  return result.data;
};
