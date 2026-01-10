"use server";

import { buildFormSchema } from "@/lib/forms/schema";
import { demoEventFormFields } from "@/lib/forms/DemoEventForm";
import { registerForEvent } from "@/lib/persistence/registration-flow";
import { getEventBySlug } from "@/lib/persistence/events";
import type { FormFieldConfig } from "@/lib/forms/types";
import { z } from "zod";

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts.shift() ?? "";
  const lastName = parts.join(" ");
  return { firstName, lastName };
};

export async function submitEventRegistration(
  eventSlug: string,
  values: Record<string, unknown>
) {
  // Load event and use its form config when available.
  const { data: event } = await getEventBySlug(eventSlug);
  const formConfig =
    (event?.form_config as unknown as FormFieldConfig[] | undefined) ??
    demoEventFormFields;

  const formSchema = buildFormSchema(formConfig);
  type FormValues = z.infer<typeof formSchema>;

  // Validate server-side for safety.
  const parsed = formSchema.parse(values);

  const { firstName, lastName } = splitName(
    (parsed as Record<string, string | boolean>)["fullName"] as string
  );

  const person = {
    firstName,
    lastName,
    email: (parsed as Record<string, string | boolean>)["email"] as string,
  };

  const attendance = (parsed as Record<string, string | boolean>)[
    "attendance"
  ] as string | undefined;
  const volunteer = Boolean(
    (parsed as Record<string, string | boolean>)["volunteer"]
  );

  const result = await registerForEvent({
    eventSlug,
    person,
    attendance: attendance ?? "",
    volunteer,
    eventId: "",
  });

  if (result.error) {
    throw result.error;
  }

  return result.data;
}
