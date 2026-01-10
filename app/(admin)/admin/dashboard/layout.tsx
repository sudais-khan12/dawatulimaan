export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="flex h-14 items-center justify-between border-b bg-white px-6">
        <div className="text-lg font-semibold">Admin</div>
        <div className="text-sm text-gray-500">Dashboard</div>
      </header>

      <div className="flex">
        <aside className="w-64 border-r bg-white px-4 py-6">
          <nav className="space-y-3 text-sm font-medium text-gray-700">
            <div className="rounded-md px-3 py-2 hover:bg-gray-100">Overview</div>
            <div className="rounded-md px-3 py-2 hover:bg-gray-100">Events</div>
            <div className="rounded-md px-3 py-2 hover:bg-gray-100">Settings</div>
          </nav>
        </aside>

        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
