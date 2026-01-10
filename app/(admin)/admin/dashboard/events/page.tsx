import { getAllEvents } from "@/lib/persistence/events";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import EventsGrid from "../../../../../components/Admin/EventsGrid";
import EventFormModal from "../../../../../components/Forms/EventFormModal";

const AdminEventsPage = async () => {
  const { data: events, error } = await getAllEvents();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
          <p className="text-sm text-gray-600">List of all events.</p>
        </div>
        <EventFormModal
          mode="create"
          triggerVariant="default"
          triggerLabel="Create event"
        />
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      ) : events.length === 0 ? (
        <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          No events found.
        </div>
      ) : (
        <EventsGrid events={events} />
      )}
    </div>
  );
};

export default AdminEventsPage;
