"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteEventAction } from "../../lib/eventActions/delete-event";

type Props = {
  eventId: string;
};

const ConfirmOverlay = ({
  onCancel,
  onConfirm,
  isPending,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-lg">
        <div className="space-y-2">
          <p className="text-base font-semibold text-gray-900">
            Delete this event?
          </p>
          <p className="text-sm text-gray-700">
            This will remove the event, its registrations, and related records.
          </p>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Confirm delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const EventActions = ({ eventId }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteEventAction(eventId);
        toast("Event deleted", {
          description: "The event and its related records were removed.",
        });
        router.refresh();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to delete event.";
        toast.error("Delete failed", { description: message });
      } finally {
        setConfirming(false);
      }
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Link
          className="inline-flex items-center rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-slate-100"
          href={`/admin/dashboard/events/${eventId}/registrations`}
        >
          Registrations
        </Link>
        <Button
          variant="destructive"
          size="sm"
          disabled={isPending}
          onClick={() => setConfirming(true)}
        >
          Delete
        </Button>
      </div>

      {mounted && confirming
        ? createPortal(
            <ConfirmOverlay
              onCancel={() => setConfirming(false)}
              onConfirm={handleDelete}
              isPending={isPending}
            />,
            document.body
          )
        : null}
    </div>
  );
};

export default EventActions;
