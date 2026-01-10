"use client";

import { useMemo, useState } from "react";

import type { RegistrationView } from "@/lib/persistence/registrations-view";

type Props = {
  rows: RegistrationView[];
};

const PAGE_SIZE = 25;

const toCsv = (rows: RegistrationView[]) => {
  const header = ["Full Name", "Email", "Attendance", "Registered At"];
  const lines = rows.map((r) =>
    [
      `"${(r.fullName ?? "").replace(/"/g, '""')}"`,
      `"${(r.email ?? "").replace(/"/g, '""')}"`,
      `"${r.attendance ?? ""}"`,
      `"${r.createdAt ? new Date(r.createdAt).toISOString() : ""}"`,
    ].join(","),
  );
  return [header.join(","), ...lines].join("\n");
};

const RegistrationsTable = ({ rows }: Props) => {
  const [search, setSearch] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState<"all" | "virtual" | "in-person">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        term.length === 0 ||
        row.fullName.toLowerCase().includes(term) ||
        row.email.toLowerCase().includes(term);
      const matchesAttendance =
        attendanceFilter === "all" ||
        (row.attendance ?? "").toLowerCase() === attendanceFilter;
      return matchesSearch && matchesAttendance;
    });
  }, [rows, search, attendanceFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageRows = filtered.slice(start, end);

  const handleExport = () => {
    const csv = toCsv(pageRows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "registrations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const showPagination = filtered.length > 50;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name or email"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 sm:w-64"
          />
          <select
            value={attendanceFilter}
            onChange={(e) => {
              setAttendanceFilter(e.target.value as "all" | "virtual" | "in-person");
              setPage(1);
            }}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 sm:w-48"
          >
            <option value="all">All attendance</option>
            <option value="virtual">Virtual</option>
            <option value="in-person">In-person</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
        >
          Export CSV
        </button>
      </div>

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
                Attendance
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Registered at
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {pageRows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 text-gray-900">{row.fullName}</td>
                <td className="px-4 py-3 text-gray-700">{row.email}</td>
                <td className="px-4 py-3 text-gray-700">
                  {row.attendance ?? "N/A"}
                </td>
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

      {showPagination && (
        <div className="flex items-center justify-between text-sm text-gray-700">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationsTable;
