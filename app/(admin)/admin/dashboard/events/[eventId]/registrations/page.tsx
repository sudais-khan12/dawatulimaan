import RegistrationsTable from "./RegistrationsTable";
import { getRegistrationsByEvent } from "@/lib/persistence/registrations-view";
import Link from "next/link";

type PageProps = {
  params: Promise<{ eventId: string }>;
};

const AdminEventRegistrationsPage = async ({ params }: PageProps) => {
  const { eventId } = await params;
  const { data, error } = await getRegistrationsByEvent(eventId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Registrations
        </h1>
        <p className="text-sm text-gray-600">Event ID: {eventId}</p>
        <div className="mt-3">
          <Link
            href="/admin/dashboard/events"
            className="inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
          >
            Back to events list
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error.message}
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          No registrations found for this event.
        </div>
      ) : (
        <RegistrationsTable rows={data} />
      )}
    </div>
  );
};

export default AdminEventRegistrationsPage;
