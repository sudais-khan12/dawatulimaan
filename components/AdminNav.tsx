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
    <nav className="space-y-2 text-sm font-semibold text-slate-800">
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
              "group flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-primary/10 hover:text-primary",
              active &&
                "bg-primary/10 text-primary shadow-sm shadow-primary/10 border border-primary/15",
            )}
          >
            {Icon && (
              <Icon
                className={cn(
                  "h-4 w-4 text-slate-500 transition group-hover:text-primary",
                  active && "text-primary",
                )}
              />
            )}
            {link.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={handleLogout}
        disabled={isPending}
        className="mt-4 flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-800 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogOut className="h-4 w-4" />
        {isPending ? "Logging out..." : "Logout"}
      </button>
    </nav>
  );
};

export default AdminNav;
