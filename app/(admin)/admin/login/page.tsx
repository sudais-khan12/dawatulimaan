import { Suspense } from "react";

import LoginForm from "../../../../components/Forms/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-white px-6 py-10 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Admin Login</h1>
          <p className="mt-3 text-sm text-gray-600">
            Access the admin dashboard.
          </p>
        </div>
        <Suspense
          fallback={<div className="text-sm text-gray-600">Loading...</div>}
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
