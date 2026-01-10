import EventRegistrationForm from "@/components/event-registration-form";
import { getEventBySlug } from "@/lib/persistence/events";
import Link from "next/link";
import { demoEventFormFields } from "@/lib/forms/DemoEventForm";

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

const EventPage = async ({ params }: EventPageProps) => {
  const { slug } = await params;
  const { data: event } = await getEventBySlug(slug);
  const formConfig = demoEventFormFields;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <div className="flex flex-1 items-center justify-center px-3 py-3 md:px-4 md:py-4">
        <div className="mx-auto w-full max-w-xl space-y-4 rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm md:px-5 md:py-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <Link
                href="/events"
                className="inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-gray-700 hover:bg-gray-100"
              >
                Back to events
              </Link>
              <Link
                href="/"
                className="inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-gray-700 hover:bg-gray-100"
              >
                Back to home
              </Link>
            </div>
            <p className="text-sm uppercase tracking-wide text-gray-500">
              Event registration
            </p>
            <h1 className="text-2xl font-semibold text-gray-900">
              {event?.title ?? slug}
            </h1>
            <div className="space-y-1 text-sm text-gray-700">
              {event?.date && (
                <div>
                  <span className="font-medium text-gray-900">Date:</span>{" "}
                  {new Date(event.date).toLocaleDateString()}
                </div>
              )}
              {event?.location && (
                <div>
                  <span className="font-medium text-gray-900">Location:</span>{" "}
                  {event.location}
                </div>
              )}
              {event?.description && (
                <p className="text-gray-600">{event.description}</p>
              )}
            </div>
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
