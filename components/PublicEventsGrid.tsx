"use client";

import { useMemo, useState } from "react";

import EventCard from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import type { EventRow } from "@/lib/persistence/events";

type Props = {
  events: EventRow[];
};

const PublicEventsGrid = ({ events }: Props) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return events.filter((event) => {
      if (!term) return true;
      return (
        (event.title ?? "").toLowerCase().includes(term) ||
        (event.location ?? "").toLowerCase().includes(term) ||
        (event.description ?? "").toLowerCase().includes(term)
      );
    });
  }, [events, search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events by title or location"
          className="w-full sm:w-80"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          No events found.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              title={event.title ?? "Untitled event"}
              slug={event.slug}
              date={event.date}
              location={event.location}
              description={event.description}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicEventsGrid;
