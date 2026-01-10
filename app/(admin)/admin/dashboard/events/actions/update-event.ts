"use server";

import { eventFormSchema } from "@/app/(admin)/admin/dashboard/events/new/schema";
import { updateEvent } from "@/lib/persistence/events";
import { slugify } from "@/lib/slugify";

export const updateEventAction = async (id: string, values: unknown) => {
  const parsed = eventFormSchema.partial().safeParse(values);
  if (!parsed.success) {
    throw new Error("Invalid event data");
  }

  const updatePayload = { ...parsed.data };

  if (parsed.data.title) {
    updatePayload.slug = slugify(parsed.data.title);
  }

  const result = await updateEvent(id, updatePayload);

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
