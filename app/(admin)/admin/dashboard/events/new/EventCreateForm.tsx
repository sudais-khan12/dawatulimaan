"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  eventFormSchema,
  type EventFormValues,
} from "@/app/(admin)/admin/dashboard/events/new/schema";
import { createEventAction } from "@/app/(admin)/admin/dashboard/events/actions/create-event";
import { Textarea } from "@/components/ui/textarea";

type EventCreateFormProps = {
  onSubmitAction?: (values: EventFormValues) => Promise<unknown>;
  submitLabel?: string;
  defaultValues?: Partial<EventFormValues>;
};

const EventCreateForm = ({
  onSubmitAction,
  submitLabel = "Create event",
  defaultValues,
}: EventCreateFormProps) => {
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message?: string;
  }>({ type: "idle" });
  const [isPending, startTransition] = useTransition();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      date: "",
      location: "",
      type: undefined,
      description: "",
      ...defaultValues,
    },
  });

  const onSubmit = (values: EventFormValues) => {
    setStatus({ type: "idle" });
    startTransition(async () => {
      try {
        const action = onSubmitAction ?? createEventAction;
        await action(values);
        setStatus({
          type: "success",
          message: submitLabel === "Create event" ? "Event created successfully." : "Changes saved.",
        });
        form.reset(
          defaultValues ?? {
            title: "",
            date: "",
            location: "",
            type: undefined,
            description: "",
          },
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create event.";
        setStatus({ type: "error", message });
      }
    });
  };

  const isSubmitting = isPending || form.formState.isSubmitting;

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Community Dinner" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="City Hall" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virtual">Virtual</SelectItem>
                      <SelectItem value="in-person">In-person</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief details about the event"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <Link
              href="/admin/dashboard/events"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back to events
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? submitLabel === "Create event"
                  ? "Creating..."
                  : "Saving..."
                : submitLabel}
            </Button>
          </div>
        </form>
      </Form>

      {status.type === "success" && status.message && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
          {status.message}
        </div>
      )}
      {status.type === "error" && status.message && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {status.message}
        </div>
      )}
    </div>
  );
};

export default EventCreateForm;
