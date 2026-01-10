"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import AdminBreadcrumbs from "@/components/Admin/AdminBreadcrumbs";
import AdminNav from "@/components/AdminNav";
import RequireAuth from "@/app/(admin)/admin/RequireAuth";

type Props = {
  children: React.ReactNode;
};

const AdminShell = ({ children }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <RequireAuth>
      <div className="min-h-screen bg-slate-50 text-gray-900">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-md border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <p className="text-lg font-semibold text-teal-700">Admin Console</p>
              <p className="text-xs text-gray-500">Charity Events</p>
            </div>
          </div>
        </header>

        <div className="flex">
          <aside className="hidden h-[calc(100vh-56px)] w-64 border-r bg-white px-4 py-6 shadow-sm md:block">
            <AdminNav />
          </aside>

          <main className="flex-1 px-4 py-6 space-y-4 overflow-hidden md:px-6 md:py-8">
            <AdminBreadcrumbs />
            {children}
          </main>
        </div>

        {open ? (
          <div className="fixed inset-0 z-50 bg-black/30 md:hidden" onClick={() => setOpen(false)}>
            <div
              className="absolute left-0 top-0 h-full w-64 bg-white px-4 py-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <AdminNav onNavigate={() => setOpen(false)} />
            </div>
          </div>
        ) : null}
      </div>
    </RequireAuth>
  );
};

export default AdminShell;
