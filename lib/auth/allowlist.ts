import { getAdminSupabaseClient } from "@/lib/supabase/admin";

export const isEmailAllowed = async (email: string) => {
  const normalized = email.trim().toLowerCase();
  const client = getAdminSupabaseClient();

  const { data, error } = await client
    .from("users")
    .select("email")
    .ilike("email", normalized)
    .maybeSingle();

  if (error) {
    console.error("Allowlist lookup failed", { error, email: normalized });
    return { allowed: false, error };
  }

  return { allowed: !!data, error: null };
};
