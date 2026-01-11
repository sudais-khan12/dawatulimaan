import Link from "next/link";

import EventRegistrationForm from "@/components/event-registration-form";
import { demoEventFormFields } from "@/lib/forms/DemoEventForm";
import { getEventBySlug } from "@/lib/persistence/events";

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

const EventPage = async ({ params }: EventPageProps) => {
  const { slug } = await params;
  const { data: event } = await getEventBySlug(slug);
  const formConfig = demoEventFormFields;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f5f8fb] to-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 md:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Event registration
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {event?.title ?? slug}
            </h1>
            <p className="text-sm text-slate-600">
              Secure your spot and keep in touch about updates.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/events"
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary/40 hover:text-primary"
            >
              Back to events
            </Link>
            <Link
              href="/"
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary/40 hover:text-primary"
            >
              Back to home
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-200/40 ring-1 ring-black/5 backdrop-blur-sm">
          <div className="space-y-3 pb-4">
            <div className="flex flex-wrap gap-3 text-sm text-slate-700">
              {event?.date && (
                <span className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 font-semibold text-slate-900">
                  Date:
                  <span className="font-medium text-slate-700">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </span>
              )}
              {event?.location && (
                <span className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 font-semibold text-slate-900">
                  Location:
                  <span className="font-medium text-slate-700">
                    {event.location}
                  </span>
                </span>
              )}
            </div>
            {event?.description && (
              <p className="text-sm leading-relaxed text-slate-700">
                {event.description}
              </p>
            )}
          </div>

          <EventRegistrationForm
            eventSlug={slug}
            eventTitle={event?.title ?? slug}
            fields={formConfig}
          />
        </div>
      </div>
    </div>
  );
};

export default EventPage;
