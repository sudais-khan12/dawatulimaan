"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EventFormModal from "../Forms/EventFormModal";
import EventActions from "../Forms/EventActions";
import type { EventRow } from "@/lib/persistence/events";

type Props = {
  events: EventRow[];
};

const PAGE_SIZE = 6;

const EventsGrid = ({ events }: Props) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "virtual" | "in-person">(
    "all"
  );
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return events.filter((event) => {
      const matchesSearch =
        term.length === 0 ||
        (event.title ?? "").toLowerCase().includes(term) ||
        (event.location ?? "").toLowerCase().includes(term);
      const matchesType =
        typeFilter === "all" ||
        (event.type ?? "").toLowerCase() === typeFilter.toLowerCase();
      return matchesSearch && matchesType;
    });
  }, [events, search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const formatDate = (value?: string | null) => {
    if (!value) return "No date";
    try {
      return new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "UTC",
      }).format(new Date(value));
    } catch {
      return value;
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search title or location"
            className="w-full sm:w-72"
          />
          <Select
            value={typeFilter}
            onValueChange={(v) => {
              setTypeFilter(v as typeof typeFilter);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="virtual">Virtual</SelectItem>
              <SelectItem value="in-person">In-person</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {pageItems.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-4 text-sm text-slate-700 shadow-sm">
          No events match your filters.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((event) => (
            <div
              key={event.id}
              className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-md shadow-slate-200/60 ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">
                  {event.title ?? "Untitled event"}
                </h3>
                <p className="text-sm text-slate-600">{formatDate(event.date)}</p>
                {event.location && (
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">Location:</span>{" "}
                    {event.location}
                  </p>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <EventFormModal
                  mode="edit"
                  eventId={event.id}
                  defaultValues={{
                    title: event.title ?? "",
                    date: event.date ?? "",
                    location: event.location ?? "",
                    type:
                      (event.type as "virtual" | "in-person" | undefined) ??
                      "virtual",
                    description: event.description ?? "",
                  }}
                  title={event.title ?? "Edit event"}
                  triggerVariant="secondary"
                  triggerSize="sm"
                  triggerLabel="Edit"
                />
                <EventActions eventId={event.id} />
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-700">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsGrid;
