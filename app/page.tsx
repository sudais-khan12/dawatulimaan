import EventCard from "@/app/components/EventCard";
import { getUpcomingEvents } from "@/lib/persistence/events";

export default async function Home() {
  const { data: events } = await getUpcomingEvents();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold text-gray-900">
          Charity Events Tool
        </h1>
        <p className="text-base text-gray-600">
          Discover upcoming events and register to participate.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
          <a
            href="/events"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all
          </a>
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
      </section>
    </main>
  );
}
