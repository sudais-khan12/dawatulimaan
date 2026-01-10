import { getSupabaseClient } from "@/lib/supabase/client";
import type { Person } from "@/schema";

export type PersonInsert = {
  firstName: string;
  lastName: string;
  email: string;
};

type SupabasePerson = Person & { id: string };

type SupabasePersonRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

const mapPerson = (row: SupabasePersonRow): SupabasePerson => ({
  id: row.id,
  fullName: `${row.first_name} ${row.last_name}`.trim(),
  email: row.email,
});

export const findPersonByEmail = async (
  email: string,
  client = getSupabaseClient(),
): Promise<{ data: SupabasePerson | null; error: Error | null }> => {
  const { data, error } = await client
    .from("people")
    .select("id, first_name, last_name, email")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    return { data: null, error };
  }

  return {
    data: data ? mapPerson(data as unknown as SupabasePersonRow) : null,
    error: null,
  };
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
      first_name: payload.firstName,
      last_name: payload.lastName,
      email: payload.email,
    })
    .select("id, first_name, last_name, email")
    .single();

  if (error) {
    return { data: null, error };
  }

  return {
    data: mapPerson(data as unknown as SupabasePersonRow),
    error: null,
  };
};
