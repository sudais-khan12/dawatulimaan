"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
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
import { createEventAction } from "@/lib/eventActions/create-event";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { eventFormSchema, EventFormValues } from "@/schema/new";

type EventCreateFormProps = {
  onSubmitAction?: (values: EventFormValues) => Promise<unknown>;
  submitLabel?: string;
  defaultValues?: Partial<EventFormValues>;
  onSuccessRedirect?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const EventCreateForm = ({
  onSubmitAction,
  submitLabel = "Create event",
  defaultValues,
  onSuccessRedirect = "/admin/dashboard/events",
  onSuccess,
  onCancel,
}: EventCreateFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
    startTransition(async () => {
      try {
        const action = onSubmitAction ?? createEventAction;
        await action(values);
        form.reset(defaultValues ?? undefined);
        if (onSuccess) onSuccess();
        else if (onSuccessRedirect) router.replace(onSuccessRedirect);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create event.";
        toast.error("Unable to save event", { description: message });
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
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Spinner className="h-4 w-4" />
                  <span>
                    {submitLabel === "Create event"
                      ? "Creating..."
                      : "Saving..."}
                  </span>
                </span>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
          {onCancel && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default EventCreateForm;
