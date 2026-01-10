import EventCard from "@/app/components/EventCard";
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

      {events.length === 0 ? (
        <div className="rounded-md border border-gray-200 bg-white px-4 py-6 text-sm text-gray-700">
          No upcoming events found.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              title={event.title ?? "Untitled event"}
              slug={event.slug}
              date={event.date}
              location={event.location}
              description={event.description}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsListPage;
