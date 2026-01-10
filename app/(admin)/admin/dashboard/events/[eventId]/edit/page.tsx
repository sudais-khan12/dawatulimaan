import Link from "next/link";

import { updateEventAction } from "@/lib/eventActions/update-event";
import { getEventById } from "@/lib/persistence/events";
import EventCreateForm from "../../../../../../../components/Forms/EventCreateForm";

type PageProps = {
  params: Promise<{ eventId: string }>;
};

const EditEventPage = async ({ params }: PageProps) => {
  const { eventId } = await params;
  const { data: event, error } = await getEventById(eventId);

  const defaultValues = event
    ? {
        title: event.title ?? "",
        date: event.date ?? "",
        location: event.location ?? "",
        type: (event.type as "virtual" | "in-person" | undefined) ?? "virtual",
        description: event.description ?? "",
      }
    : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit event</h1>
          <p className="text-sm text-gray-600">Update event details.</p>
        </div>
        <Link
          href="/admin/dashboard/events"
          className="inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
        >
          Back to events
        </Link>
      </div>
      {error || !event ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error?.message ?? "Event not found."}
        </div>
      ) : (
        <EventCreateForm
          onSubmitAction={updateEventAction.bind(null, eventId)}
          submitLabel="Save changes"
          defaultValues={defaultValues}
          onSuccessRedirect="/admin/dashboard/events"
        />
      )}
    </div>
  );
};

export default EditEventPage;
