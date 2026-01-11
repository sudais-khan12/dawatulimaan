"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient, type CookieOptions } from "@supabase/ssr";

type Status =
  | { state: "checking" | "authenticating" | "verifying" }
  | { state: "error"; message: string }
  | { state: "success" };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function AuthCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<Status>({ state: "checking" });

  useEffect(() => {
    const next = params.get("next") || "/admin/dashboard";
    const run = async () => {
      try {
        setStatus({ state: "authenticating" });
        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
          cookies: {
            get(name: string) {
              const match = document.cookie
                .split("; ")
                .find((row) => row.startsWith(`${name}=`));
              return match
                ? decodeURIComponent(match.split("=")[1] || "")
                : undefined;
            },
            set(name: string, value: string, options: CookieOptions) {
              const parts = [`${name}=${encodeURIComponent(value)}`, "path=/"];
              if (options?.maxAge !== undefined) {
                parts.push(`max-age=${options.maxAge}`);
              }
              if (options?.expires) {
                parts.push(`expires=${options.expires.toUTCString()}`);
              }
              if (options?.domain) {
                parts.push(`domain=${options.domain}`);
              }
              if (options?.secure) {
                parts.push("secure");
              }
              const sameSite = options?.sameSite ?? "lax";
              parts.push(`samesite=${sameSite}`);
              document.cookie = parts.join("; ");
            },
            remove(name: string, options: CookieOptions) {
              const parts = [`${name}=`, "path=/", "max-age=0"];
              if (options?.domain) {
                parts.push(`domain=${options.domain}`);
              }
              if (options?.secure) {
                parts.push("secure");
              }
              if (options?.sameSite) {
                parts.push(`samesite=${options.sameSite}`);
              }
              document.cookie = parts.join("; ");
            },
          },
        });

        // Parse hash fragment (implicit flow) for access/refresh tokens.
        const hash = window.location.hash.substring(1);
        const fragments = new URLSearchParams(hash);
        const access_token = fragments.get("access_token");
        const refresh_token = fragments.get("refresh_token");
        const code = params.get("code");

        if (access_token && refresh_token) {
          const { error: setError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (setError) {
            setStatus({
              state: "error",
              message: "Auth failed. Please retry.",
            });
            router.replace("/admin/login?error=auth_failed");
            return;
          }
        } else if (code) {
          const { error: exchError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchError) {
            setStatus({
              state: "error",
              message: "Auth failed. Please retry.",
            });
            router.replace("/admin/login?error=auth_failed");
            return;
          }
        } else {
          setStatus({ state: "error", message: "Invalid or expired link." });
          router.replace("/admin/login?error=missing_code");
          return;
        }

        // Get the current user email to check allowlist.
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError || !userData?.user?.email) {
          setStatus({ state: "error", message: "Auth failed. Please retry." });
          router.replace("/admin/login?error=auth_failed");
          return;
        }

        setStatus({ state: "verifying" });
        const allowlistRes = await fetch("/api/auth/allowlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userData.user.email }),
        });
        if (!allowlistRes.ok) {
          setStatus({
            state: "error",
            message: "Not authorized for admin access.",
          });
          await supabase.auth.signOut();
          router.replace("/admin/login?error=unauthorized");
          return;
        }

        setStatus({ state: "success" });
        router.replace(next);
      } catch (err) {
        console.error(err);
        setStatus({
          state: "error",
          message: "Something went wrong. Please retry.",
        });
        router.replace("/admin/login?error=auth_failed");
      }
    };

    void run();
  }, [params, router]);

  const message =
    status.state === "authenticating"
      ? "Signing you in..."
      : status.state === "verifying"
      ? "Verifying access..."
      : status.state === "error"
      ? status.message
      : "Checking link...";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-lg border bg-white px-6 py-8 text-center shadow-sm">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-gray-900">
            Completing sign-in
          </h1>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
          <div className="w-full max-w-md rounded-lg border bg-white px-6 py-8 text-center shadow-sm">
            <div className="space-y-2">
              <h1 className="text-xl font-semibold text-gray-900">
                Completing sign-in
              </h1>
              <p className="text-sm text-gray-600">Checking link...</p>
            </div>
          </div>
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
