"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const formatPart = (part: string) => {
  if (!part) return "";
  return part
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const AdminBreadcrumbs = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label = formatPart(seg);
    return { href, label };
  });

  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
      {crumbs.map((crumb, idx) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {idx > 0 && <span className="text-gray-400">/</span>}
          {idx === crumbs.length - 1 ? (
            <span className="font-medium text-gray-900">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-gray-900">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
};

export default AdminBreadcrumbs;
