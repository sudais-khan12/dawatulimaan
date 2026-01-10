"use server";

import { buildFormSchema } from "@/lib/forms/schema";
import { demoEventFormFields } from "@/lib/forms/DemoEventForm";
import { registerForEvent } from "@/lib/persistence/registration-flow";
import { z } from "zod";

const formSchema = buildFormSchema(demoEventFormFields);
type FormValues = z.infer<typeof formSchema>;

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts.shift() ?? "";
  const lastName = parts.join(" ");
  return { firstName, lastName };
};

export async function submitEventRegistration(
  eventSlug: string,
  values: FormValues
) {
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
