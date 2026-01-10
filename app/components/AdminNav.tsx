"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";

import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/(admin)/login/actions/logout";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/dashboard/events", label: "Events" },
  { href: "/admin/dashboard/users", label: "Users" },
];

const AdminNav = () => {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <nav className="space-y-2 text-sm font-medium text-gray-700">
      {links.map((link) => {
        const active =
          pathname === link.href ||
          (link.href !== "/admin/dashboard" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block rounded-md px-3 py-2 hover:bg-gray-100",
              active && "bg-gray-100 text-gray-900",
            )}
          >
            {link.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={handleLogout}
        disabled={isPending}
        className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Logging out..." : "Logout"}
      </button>
    </nav>
  );
};

export default AdminNav;
