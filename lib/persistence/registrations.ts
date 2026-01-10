import { findOrCreatePersonByEmail, type PersonInsert } from "@/lib/persistence/people";
import { getSupabaseClient } from "@/lib/supabase/client";

export type RegistrationInsert = {
  person: PersonInsert;
  eventId: string;
  answers: Record<string, unknown>;
};

type SupabaseRegistration = {
  id: string;
  person_id: string;
  event_id: string;
  answers: Record<string, unknown>;
  created_at?: string;
};

export const createRegistration = async (
  payload: RegistrationInsert,
  client = getSupabaseClient(),
): Promise<{ data: SupabaseRegistration | null; error: Error | null }> => {
  const { data: person, error: personError } = await findOrCreatePersonByEmail(
    payload.person,
    client,
  );

  if (personError) {
    return { data: null, error: personError };
  }

  if (!person) {
    return { data: null, error: new Error("Unable to resolve person record.") };
  }

  const { data, error } = await client
    .from("registrations")
    .insert({
      person_id: person.id,
      event_id: payload.eventId,
      answers: payload.answers,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: data as SupabaseRegistration, error: null };
};
