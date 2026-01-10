import Nav from "./Nav";

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
          <Nav />
        </aside>

        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
