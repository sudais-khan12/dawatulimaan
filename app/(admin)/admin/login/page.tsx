import { Suspense } from "react";

import LoginForm from "../../../../components/Forms/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-[#f5f8fb] to-white px-6 py-10">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200/80 bg-white/95 px-7 py-10 shadow-xl shadow-slate-200/50 ring-1 ring-black/5 backdrop-blur-sm">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Admin access
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Sign in</h1>
          <p className="text-sm text-slate-600">
            Use your allowlisted email to get a magic link.
          </p>
        </div>
        <Suspense
          fallback={<div className="text-sm text-slate-600">Loading...</div>}
        >
          <LoginForm />
        </Suspense>
        <p className="text-xs text-slate-500">
          Having trouble? Contact an existing admin to add your email.
        </p>
      </div>
    </div>
  );
}
