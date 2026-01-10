"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
];

const PublicNav = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:py-4">
        <Link href="/" className="text-lg font-semibold text-gray-900">
          Charity Events
        </Link>
        <button
          type="button"
          aria-label="Toggle navigation"
          className="rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <nav className="hidden items-center gap-4 md:flex">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100",
                  active && "bg-gray-100 text-gray-900",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {open && (
        <nav className="border-t bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {links.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100",
                    active && "bg-gray-100 text-gray-900",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};

export default PublicNav;
