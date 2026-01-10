import Link from "next/link";

import PublicEventsGrid from "@/components/PublicEventsGrid";
import { getUpcomingEvents } from "@/lib/persistence/events";
import { getSessionFromCookies } from "@/lib/auth/session";

export default async function Home() {
  const { data: events } = await getUpcomingEvents();
  const session = await getSessionFromCookies();
  const isAdmin = session?.role === "admin";

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold text-gray-900">
          Charity Events Tool
        </h1>
        <p className="text-base text-gray-600">
          Discover upcoming events and register to participate.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {isAdmin ? (
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
            >
              Go to dashboard
            </Link>
          ) : (
            <Link
              href="/admin/login"
              className="inline-flex items-center rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-slate-100"
            >
              Admin login
            </Link>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
          <Link
            href="/events"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>

        <PublicEventsGrid events={events} />
      </section>
    </main>
  );
}
