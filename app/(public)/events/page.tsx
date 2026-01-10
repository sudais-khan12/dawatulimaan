import PublicEventsGrid from "@/components/PublicEventsGrid";
import { getUpcomingEvents } from "@/lib/persistence/events";

const EventsListPage = async () => {
  const { data: events } = await getUpcomingEvents();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
        <p className="text-sm text-gray-600">
          Explore upcoming events and register to attend.
        </p>
      </div>

      <PublicEventsGrid events={events} />
    </div>
  );
};

export default EventsListPage;
