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
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Events
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Manage events</h1>
          <p className="text-sm text-slate-600">Create, edit, and filter events.</p>
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
        <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-4 text-sm text-slate-700 shadow-sm">
          No events found.
        </div>
      ) : (
        <EventsGrid events={events} />
      )}
    </div>
  );
};

export default AdminEventsPage;
