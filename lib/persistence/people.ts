import { getSupabaseClient } from "@/lib/supabase/client";
import type { Person } from "@/schema";

export type PersonInsert = {
  fullName: string;
  email: string;
  phone?: string | null;
};

type SupabasePerson = Person & { id: string };

export const findPersonByEmail = async (
  email: string,
  client = getSupabaseClient(),
): Promise<{ data: SupabasePerson | null; error: Error | null }> => {
  const { data, error } = await client
    .from("people")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
};

export const findOrCreatePersonByEmail = async (
  payload: PersonInsert,
  client = getSupabaseClient(),
): Promise<{ data: SupabasePerson | null; error: Error | null }> => {
  const existing = await findPersonByEmail(payload.email, client);
  if (existing.error) {
    return existing;
  }

  if (existing.data) {
    return existing;
  }

  const { data, error } = await client
    .from("people")
    .insert({
      full_name: payload.fullName,
      email: payload.email,
      phone: payload.phone ?? null,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: data as SupabasePerson, error: null };
};
