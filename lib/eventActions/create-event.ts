"use server";

import { createEvent } from "@/lib/persistence/events";
import { slugify } from "@/lib/slugify";
import { eventFormSchema } from "@/schema/new";

export const createEventAction = async (values: unknown) => {
  const parsed = eventFormSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error("Invalid event data");
  }

  const slug = slugify(parsed.data.title);

  const result = await createEvent({
    ...parsed.data,
    slug,
  });

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
