import { NextResponse } from "next/server";
import { getRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { isEmailAllowed } from "@/lib/auth/allowlist";

export async function POST() {
  const supabase = await getRouteHandlerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  const allowlist = await isEmailAllowed(email);

  if (!allowlist.allowed) {
    return NextResponse.json(
      { error: "Forbidden", detail: allowlist.error?.message },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true });
}
