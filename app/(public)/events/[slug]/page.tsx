import EventRegistrationForm from "@/app/components/event-registration-form";
import { getEventBySlug } from "@/lib/persistence/events";
import Link from "next/link";
import type { FormFieldConfig } from "@/lib/forms/types";
import { demoEventFormFields } from "@/lib/forms/DemoEventForm";

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

const EventPage = async ({ params }: EventPageProps) => {
  const { slug } = await params;
  const { data: event } = await getEventBySlug(slug);
  const formConfig =
    (event?.form_config as unknown as FormFieldConfig[] | undefined) ??
    demoEventFormFields;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-3xl space-y-8 rounded-lg border bg-white px-6 py-12 shadow-sm">
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
  );
};

export default EventPage;
