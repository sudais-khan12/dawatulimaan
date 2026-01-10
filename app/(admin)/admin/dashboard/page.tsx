import Link from "next/link";

import { Button } from "@/components/ui/button";

const AdminDashboardPage = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p className="text-sm text-gray-600">
        High-level snapshot of admin activity will appear here.
      </p>

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
  );
};

export default AdminDashboardPage;
