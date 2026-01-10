"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import EventCreateForm from "./EventCreateForm";
import { createEventAction } from "../../lib/eventActions/create-event";
import { updateEventAction } from "../../lib/eventActions/update-event";
import { Button } from "@/components/ui/button";
import { EventFormValues } from "@/schema/new";

type Props = {
  mode: "create" | "edit";
  eventId?: string;
  defaultValues?: Partial<EventFormValues>;
  title?: string;
  triggerLabel?: string;
  triggerVariant?: "default" | "outline" | "secondary" | "destructive";
  triggerSize?: "sm" | "default";
};

const EventFormModal = ({
  mode,
  eventId,
  defaultValues,
  title,
  triggerLabel = mode === "create" ? "Create event" : "Edit",
  triggerVariant = mode === "create" ? "default" : "outline",
  triggerSize = "default",
}: Props) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSuccess = () => {
    toast(mode === "create" ? "Event created" : "Event updated");
    setOpen(false);
    router.refresh();
  };

  const action =
    mode === "create"
      ? createEventAction
      : eventId
      ? updateEventAction.bind(null, eventId)
      : undefined;

  if (!action) return null;

  return (
    <>
      <Button variant={triggerVariant} size={triggerSize} onClick={handleOpen}>
        {triggerLabel}
      </Button>
      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
              <div className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-gray-500">
                      {mode === "create" ? "Create event" : "Edit event"}
                    </p>
                    {title ? (
                      <p className="text-base font-semibold text-gray-900">
                        {title}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="text-sm text-gray-500 hover:text-gray-800"
                    onClick={handleClose}
                  >
                    ✕
                  </button>
                </div>
                <EventCreateForm
                  onSubmitAction={async (values) => {
                    await action(values);
                    onSuccess();
                  }}
                  submitLabel={
                    mode === "create" ? "Create event" : "Save changes"
                  }
                  defaultValues={defaultValues}
                  onSuccess={onSuccess}
                  onCancel={handleClose}
                  onSuccessRedirect=""
                />
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
};

export default EventFormModal;
