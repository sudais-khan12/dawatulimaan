import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE, AUTH_SECRET } from "@/lib/auth/constants";
import { verifySessionTokenEdge } from "@/lib/auth/session-edge";

const ADMIN_PATH = "/admin";
const LOGIN_PATH = "/admin/login";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith(ADMIN_PATH);
  const isLoginRoute = pathname.startsWith(LOGIN_PATH);

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  if (!AUTH_SECRET) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionTokenEdge(token) : null;

  // Allow unauthenticated access to the login route to avoid redirect loops.
  if (isLoginRoute) {
    if (session && session.role === "admin") {
      const dashboardUrl = new URL("/admin/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();
  }

  // For other admin routes, enforce auth.
  if (!session || session.role !== "admin") {
    const redirectUrl = new URL(LOGIN_PATH, request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
