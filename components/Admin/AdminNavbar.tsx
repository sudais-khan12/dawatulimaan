"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [{ href: "/admin/dashboard/events", label: "Events" }];

const AdminNavbar = () => {
  const pathname = usePathname();

  return (
    <nav className="space-y-2 text-sm font-medium text-gray-700">
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block rounded-md px-3 py-2 hover:bg-gray-100",
              isActive && "bg-gray-100 text-gray-900"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default AdminNavbar;
