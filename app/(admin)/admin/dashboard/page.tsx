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
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">
            Overview of events, registrations, and users.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/admin/dashboard/events/new">Create new event</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/dashboard/events">View events</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/dashboard/users/new">Add users</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700">
            Recent registrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-gray-600">No recent registrations.</p>
          ) : (
            <div className="grid gap-3">
              {recent.map((row) => (
                <div
                  key={row.id}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {row.person}
                      </p>
                      <p className="text-xs text-gray-600">{row.email}</p>
                    </div>
                    <p className="text-xs text-gray-600">
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-700">
                    <span className="rounded-full bg-teal-50 px-2 py-1 font-medium text-teal-700">
                      {row.event}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-gray-800">
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
