"use client";

import { useMemo, useState, useTransition } from "react";
import { z } from "zod";

import FormRenderer from "@/app/components/FormRenderer";
import { demoEventFormFields } from "@/lib/forms/DemoEventForm";
import { buildFormSchema } from "@/lib/forms/schema";
import type { FormFieldConfig } from "@/lib/forms/types";
import { submitEventRegistration } from "../(public)/events/[slug]/actions/register";

type SubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

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
  const [state, setState] = useState<SubmissionState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();
  const [submittedValues, setSubmittedValues] = useState<
    Record<string, unknown> | null
  >(null);

  const formSchema = useMemo(() => buildFormSchema(fields), [fields]);
  type FormValues = z.infer<typeof formSchema>;

  const handleSubmit = (values: Record<string, unknown>) => {
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      setState({
        status: "error",
        message: "Please check the form for required fields.",
      });
      return;
    }

    setState({ status: "submitting" });

    startTransition(async () => {
      try {
        await submitEventRegistration(eventSlug, parsed.data as FormValues);
        setSubmittedValues(parsed.data);
        setState({
          status: "success",
          message: "Registration received. Thank you!",
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.";
        setState({ status: "error", message });
      }
    });
  };

  const isBusy = isPending || state.status === "submitting";
  const isDisabled = state.status === "success";

  return (
    <div className="space-y-4">
      {state.status === "success" ? (
        <div className="space-y-3 rounded-md border border-green-200 bg-green-50 px-4 py-4">
          <h2 className="text-lg font-semibold text-green-900">
            Registration confirmed
          </h2>
          <p className="text-sm text-green-900">
            You’re registered for {eventTitle ?? "the event"}. A confirmation
            email will be sent if available.
          </p>
        </div>
      ) : (
        <FormRenderer
          fields={fields}
          onSubmit={handleSubmit}
          key={isDisabled ? "submitted" : "active"}
          disabled={isDisabled}
        />
      )}
      {state.status === "error" && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {state.message}
        </div>
      )}
      {isBusy && state.status === "submitting" && (
        <div className="text-sm text-muted-foreground">Submitting...</div>
      )}
    </div>
  );
};

export default EventRegistrationForm;
