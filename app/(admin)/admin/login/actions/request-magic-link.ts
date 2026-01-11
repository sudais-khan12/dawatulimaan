"use server";

import { isEmailAllowed } from "@/lib/auth/allowlist";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL as string;

if (!supabaseUrl || !supabaseAnonKey || !siteUrl) {
  throw new Error(
    "Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and NEXT_PUBLIC_SITE_URL."
  );
}

type ActionState = {
  status: "idle" | "sent" | "error";
  message: string;
};

const initialState: ActionState = {
  status: "idle",
  message: "",
};

export async function requestMagicLink(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: ActionState = initialState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const next = String(formData.get("next") ?? "").trim();

  if (!email) {
    return { status: "error", message: "Email is required." };
  }

  const allowlistResult = await isEmailAllowed(email);
  if (allowlistResult.error) {
    return {
      status: "error",
      message: "Unable to verify access. Please try again.",
    };
  }

  if (!allowlistResult.allowed) {
    return {
      status: "error",
      message: "This email is not authorized for admin access.",
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback${
        next ? `?next=${encodeURIComponent(next)}` : ""
      }`,
    },
  });

  if (error) {
    console.error("Magic link request failed", { error, email });
    return {
      status: "error",
      message: "Failed to send magic link. Please try again.",
    };
  }

  return {
    status: "sent",
    message: "Check your email for the magic link.",
  };
}
