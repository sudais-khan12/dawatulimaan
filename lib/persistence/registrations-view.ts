import { getSupabaseClient } from "@/lib/supabase/client";

type RegistrationRow = {
  id: string;
  created_at: string | null;
  person_id: string;
  people: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  } | null;
};

export type RegistrationView = {
  id: string;
  personId: string;
  fullName: string;
  email: string;
  createdAt: string | null;
};

export const getRegistrationsByEvent = async (
  eventId: string,
  client = getSupabaseClient()
): Promise<{ data: RegistrationView[]; error: Error | null }> => {
  const { data, error } = await client
    .from("registrations")
    .select(
      "id, created_at, person_id, people:person_id(first_name, last_name, email)"
    )
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return { data: [], error: error ?? new Error("No registrations found") };
  }

  const mapped = (data as unknown as RegistrationRow[]).map((row) => ({
    id: row.id,
    personId: row.person_id,
    fullName:
      `${row.people?.first_name ?? ""} ${row.people?.last_name ?? ""}`.trim() ||
      "Unknown",
    email: row.people?.email ?? "Unknown",
    createdAt: row.created_at,
  }));

  return { data: mapped, error: null };
};
