"use server";

import { updateEvent } from "@/lib/persistence/events";
import { slugify } from "@/lib/slugify";
import { eventFormSchema, EventFormValues } from "@/schema/new";

export const updateEventAction = async (id: string, values: unknown) => {
  const parsed = eventFormSchema.partial().safeParse(values);
  if (!parsed.success) {
    throw new Error("Invalid event data");
  }

  const updatePayload: Partial<EventFormValues & { slug?: string }> = {
    ...parsed.data,
  };

  if (parsed.data.title) {
    updatePayload.slug = slugify(parsed.data.title);
  }

  const result = await updateEvent(id, updatePayload);

  if (result.error) {
    if (
      typeof (result.error as unknown as { code?: string }).code === "string"
    ) {
      const code = (result.error as unknown as { code?: string }).code;
      if (code === "23505" || code === "409") {
        throw new Error("Slug already exists. Please choose another.");
      }
    }
    throw result.error;
  }

  return result.data;
};
