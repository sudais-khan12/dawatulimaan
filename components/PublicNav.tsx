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
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg shadow-sm shadow-slate-200/50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-slate-900"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
            CE
          </span>
          <span className="leading-tight">Charity Events</span>
        </Link>
        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            aria-label="Toggle navigation"
            className="rounded-lg border border-slate-200 bg-white/80 px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary/40 hover:text-primary"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-primary/10 hover:text-primary",
                  active &&
                    "bg-primary/10 text-primary shadow-sm shadow-primary/10 border border-primary/15"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {open && (
        <nav className="border-t border-slate-200 bg-white px-4 py-3 md:hidden shadow-md shadow-slate-200/60">
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
                    "rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-primary/10 hover:text-primary",
                    active &&
                      "bg-primary/10 text-primary shadow-sm shadow-primary/10 border border-primary/15"
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
