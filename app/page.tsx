import Link from "next/link";

export default async function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold text-gray-900">
          Charity Events Tool
        </h1>
        <p className="text-base text-gray-600">
          Discover upcoming events and register to participate.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Upcoming Events
          </h2>
          <Link
            href="/events"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all Events
          </Link>
        </div>

        <h1 className="text-5xl">Coming Soon</h1>
      </section>
    </main>
  );
}
