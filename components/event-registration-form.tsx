"use client";

import { useMemo, useTransition } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import FormRenderer from "@/components/FormRenderer";
import { demoEventFormFields } from "@/lib/forms/DemoEventForm";
import { buildFormSchema } from "@/lib/forms/schema";
import type { FormFieldConfig } from "@/lib/forms/types";
import { submitEventRegistration } from "../lib/registerEvent";

type EventRegistrationFormProps = {
  eventSlug: string;
  eventTitle?: string;
  fields?: FormFieldConfig[];
};

const EventRegistrationForm = ({
  eventSlug,
  eventTitle,
  fields = demoEventFormFields,
}: EventRegistrationFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const formSchema = useMemo(() => buildFormSchema(fields), [fields]);
  type FormValues = z.infer<typeof formSchema>;

  const handleSubmit = (values: Record<string, unknown>) => {
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      toast.error("Please check the form for required fields.");
      return;
    }

    startTransition(async () => {
      try {
        await submitEventRegistration(eventSlug, parsed.data as FormValues);
        toast("Registration confirmed", {
          description: `You’re registered for ${eventTitle ?? "the event"}.`,
        });
        router.replace("/");
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.";
        toast.error("Registration failed", {
          description: message,
        });
      }
    });
  };

  return (
    <div className="space-y-4">
      <FormRenderer
        fields={fields}
        onSubmit={handleSubmit}
        key="active"
        disabled={isPending}
      />
    </div>
  );
};

export default EventRegistrationForm;
