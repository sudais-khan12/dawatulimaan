import PublicEventsGrid from "@/components/PublicEventsGrid";
import { getUpcomingEvents } from "@/lib/persistence/events";

const EventsListPage = async () => {
  const { data: events } = await getUpcomingEvents();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f5f8fb] to-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Events
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Upcoming events
            </h1>
            <p className="text-sm text-slate-600">
              Explore events and register in a few clicks.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-200/40 ring-1 ring-black/5 backdrop-blur-sm">
          <PublicEventsGrid events={events} />
        </div>
      </div>
    </div>
  );
};

export default EventsListPage;
