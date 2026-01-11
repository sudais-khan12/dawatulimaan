import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getDashboardCounts,
  getRecentRegistrations,
} from "@/lib/persistence/metrics";

const AdminDashboardPage = async () => {
  const counts = await getDashboardCounts();
  const recent = await getRecentRegistrations(5);

  const stats = [
    { label: "Events", value: counts.events },
    { label: "Registrations", value: counts.registrations },
    { label: "Users", value: counts.users },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Admin overview
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600">
            Key metrics and latest activity at a glance.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/dashboard/events">View events</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/dashboard/users/new">Add users</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="bg-white/95 px-0 py-0 shadow-md shadow-slate-200/60 ring-1 ring-black/5"
          >
            <CardHeader className="px-5 pb-2 pt-5">
              <CardTitle className="text-sm font-semibold text-slate-600">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="text-3xl font-bold text-slate-900">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white/95 shadow-md shadow-slate-200/60 ring-1 ring-black/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">
            Recent registrations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recent.length === 0 ? (
            <p className="text-sm text-slate-600">No recent registrations.</p>
          ) : (
            <div className="grid gap-3">
              {recent.map((row) => (
                <div
                  key={row.id}
                  className="rounded-xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm shadow-slate-200/60"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {row.person}
                      </p>
                      <p className="text-xs text-slate-600">{row.email}</p>
                    </div>
                    <p className="text-xs text-slate-600">
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-700">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">
                      {row.event}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-800">
                      {row.attendance ?? "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
