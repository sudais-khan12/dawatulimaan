import { getRegistrationsByEvent } from "@/lib/persistence/registrations-view";

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
        <p className="text-sm text-gray-600">
          Event ID: {eventId}
        </p>
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
        <div className="overflow-hidden rounded-md border">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Full name
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Registered at
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {data.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 text-gray-900">{row.fullName}</td>
                  <td className="px-4 py-3 text-gray-700">{row.email}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminEventRegistrationsPage;
