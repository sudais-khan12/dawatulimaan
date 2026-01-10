import Link from "next/link";

import { getAllUsers } from "@/lib/persistence/users";
import UsersListClient from "./UsersListClient";

const UsersListPage = async () => {
  const { data: users, error } = await getAllUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-600">Manage admin users.</p>
        </div>
        <Link
          href="/admin/dashboard/users/new"
          className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add user
        </Link>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error.message}
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          No users found.
        </div>
      ) : (
        <UsersListClient users={users} />
      )}
    </div>
  );
};

export default UsersListPage;
