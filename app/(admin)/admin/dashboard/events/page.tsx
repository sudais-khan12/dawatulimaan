import Link from "next/link";

import { getAllEvents } from "@/lib/persistence/events";

const AdminEventsPage = async () => {
  const { data: events, error } = await getAllEvents();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
          <p className="text-sm text-gray-600">List of all events.</p>
        </div>
        <Link
          href="/admin/dashboard/events/new"
          className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Create event
        </Link>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error.message}
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          No events found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-4 py-3 text-gray-900">
                    {event.title ?? "Untitled event"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {event.date
                      ? new Date(event.date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-700 space-x-3">
                    <Link
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      href={`/admin/dashboard/events/${event.id}/edit`}
                    >
                      Edit
                    </Link>
                    <Link
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      href={`/admin/dashboard/events/${event.id}/registrations`}
                    >
                      Registrations
                    </Link>
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

export default AdminEventsPage;
