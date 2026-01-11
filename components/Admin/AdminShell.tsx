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
      <div className="min-h-screen bg-gradient-to-b from-white via-[#f5f8fb] to-white text-gray-900">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 shadow-sm shadow-slate-200/50 backdrop-blur-sm md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white/70 p-2 text-slate-700 shadow-sm transition hover:border-primary/40 hover:text-primary md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <p className="text-lg font-bold text-slate-900">Admin Console</p>
              <p className="text-xs text-slate-500">Charity Events</p>
            </div>
          </div>
        </header>

        <div className="flex">
          <aside className="hidden sticky top-16 h-[calc(100vh-64px)] w-68 shrink-0 border-r border-slate-200/80 bg-white/95 px-4 py-6 shadow-md shadow-slate-200/50 ring-1 ring-black/5 backdrop-blur-sm md:block">
            <AdminNav />
          </aside>

          <main className="flex-1 space-y-4 px-4 py-6 md:px-6 md:py-8">
            <AdminBreadcrumbs />
            {children}
          </main>
        </div>

        {open ? (
          <div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] md:hidden"
            onClick={() => setOpen(false)}
          >
            <div
              className="absolute left-0 top-0 h-full w-72 border-r border-slate-200/80 bg-white/95 px-4 py-6 shadow-xl shadow-slate-200/60 ring-1 ring-black/5 backdrop-blur-sm"
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
