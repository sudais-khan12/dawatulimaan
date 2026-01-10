import FormRenderer from "@/app/components/FormRenderer";
import { demoEventFormFields } from "@/lib/forms/DemoEventForm";

type EventPageProps = {
  params: { slug: string };
};

const EventPage = ({ params }: EventPageProps) => {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-3xl space-y-8 rounded-lg border bg-white px-6 py-12 shadow-sm">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Event registration
          </p>
          <h1 className="text-2xl font-semibold text-gray-900">
            {params.slug}
          </h1>
          <p className="text-sm text-gray-600">
            Demo form driven entirely by configuration to showcase dynamic
            fields per event.
          </p>
        </div>

        <FormRenderer fields={demoEventFormFields} />
      </div>
    </div>
  );
};

export default EventPage;
