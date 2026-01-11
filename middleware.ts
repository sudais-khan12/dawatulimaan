import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/admin/login");

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase configuration missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  const res = NextResponse.next();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        res.cookies.set(name, value, options);
      },
      remove(name: string, options: CookieOptions) {
        res.cookies.set(name, "", { ...options, maxAge: 0 });
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If already logged in and visiting login, send to dashboard to avoid loop.
  if (isLoginRoute) {
    if (session) {
      const redirectUrl = new URL("/admin/dashboard", req.url);
      const redirectRes = NextResponse.redirect(redirectUrl);
      res.cookies.getAll().forEach((cookie) => {
        redirectRes.cookies.set(cookie);
      });
      return redirectRes;
    }
    return res;
  }

  if (!session) {
    const redirectUrl = new URL("/admin/login", req.url);
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
    const redirectRes = NextResponse.redirect(redirectUrl);
    res.cookies.getAll().forEach((cookie) => {
      redirectRes.cookies.set(cookie);
    });
    return redirectRes;
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
