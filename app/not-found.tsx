import Link from "next/link";

const NotFound = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center text-gray-800">
      <div className="space-y-3">
        <p className="text-sm font-medium text-teal-700">404</p>
        <h1 className="text-3xl font-semibold text-gray-900">Page not found</h1>
        <p className="text-sm text-gray-600">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800"
          >
            Go home
          </Link>
          <Link
            href="/events"
            className="inline-flex items-center rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-slate-100"
          >
            Browse events
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
