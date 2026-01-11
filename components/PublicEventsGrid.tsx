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
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, location, or description"
          className="w-full sm:w-96"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-4 text-sm text-slate-700 shadow-sm">
          No events found. Try a different search.
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
