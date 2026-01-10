import Link from "next/link";

const EditEventPage = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit event</h1>
          <p className="text-sm text-gray-600">Event editing will be implemented here.</p>
        </div>
        <Link
          href="/admin/dashboard/events"
          className="inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
        >
          Back to events
        </Link>
      </div>
      <div className="rounded-md border border-gray-200 bg-white px-4 py-6 text-sm text-gray-700">
        Editing form placeholder.
      </div>
    </div>
  );
};

export default EditEventPage;
