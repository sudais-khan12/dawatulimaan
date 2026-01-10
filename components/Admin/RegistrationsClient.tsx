"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RegistrationView } from "@/lib/persistence/registrations-view";
import { deleteRegistrationAction } from "@/lib/eventActions/delete-registration";

type Props = {
  rows: RegistrationView[];
  onChanged?: () => void;
};

const PAGE_SIZE = 10;

const RegistrationsClient = ({ rows, onChanged }: Props) => {
  const [search, setSearch] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState<"all" | "virtual" | "in_person" | "undecided">("all");
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        term.length === 0 ||
        row.fullName.toLowerCase().includes(term) ||
        row.email.toLowerCase().includes(term);
      const matchesAttendance =
        attendanceFilter === "all" ||
        (row.attendance ?? "").toLowerCase() === attendanceFilter.toLowerCase();
      return matchesSearch && matchesAttendance;
    });
  }, [rows, search, attendanceFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  const handleDelete = (registrationId: string) => {
    startTransition(async () => {
      try {
        await deleteRegistrationAction(registrationId);
        toast("Registration deleted", {
          description: "The attendee has been removed from this event.",
        });
        if (onChanged) {
          onChanged();
        } else {
          router.refresh();
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to delete registration.";
        toast.error("Delete failed", { description: message });
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name or email"
            className="w-full sm:w-64"
          />
          <Select
            value={attendanceFilter}
            onValueChange={(v) => {
              setAttendanceFilter(v as typeof attendanceFilter);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Attendance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="in_person">In-person</SelectItem>
              <SelectItem value="virtual">Virtual</SelectItem>
              <SelectItem value="undecided">Undecided</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {pageRows.length === 0 ? (
        <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          No registrations match your filters.
        </div>
      ) : (
        <div className="grid gap-3">
          {pageRows.map((row) => (
            <div
              key={row.id}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{row.fullName}</p>
                  <p className="text-xs text-gray-600">{row.email}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <span className="rounded-full bg-slate-100 px-2 py-1">
                    {row.attendance ?? "N/A"}
                  </span>
                  <span className="text-gray-500">
                    {row.createdAt ? new Date(row.createdAt).toLocaleString() : "N/A"}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(row.id)}
                  disabled={isPending}
                >
                  {isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-700">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isPending}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isPending}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationsClient;
