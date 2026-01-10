"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { CalendarRange, LayoutDashboard, LogOut, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/logout";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/events", label: "Events", icon: CalendarRange },
  { href: "/admin/dashboard/users", label: "Users", icon: Users },
];

type Props = {
  onNavigate?: () => void;
};

const AdminNav = ({ onNavigate }: Props) => {
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
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 transition hover:bg-teal-50 hover:text-teal-700",
              active && "bg-teal-50 text-teal-700",
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {link.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={handleLogout}
        disabled={isPending}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogOut className="h-4 w-4" />
        {isPending ? "Logging out..." : "Logout"}
      </button>
    </nav>
  );
};

export default AdminNav;
