import { findOrCreatePersonByEmail, type PersonInsert } from "@/lib/persistence/people";
import { getSupabaseClient } from "@/lib/supabase/client";

export type RegistrationInsert = {
  person: PersonInsert;
  eventId: string;
  attendance: string;
  volunteer: boolean;
};

type SupabaseRegistration = {
  id: string;
  person_id: string;
  event_id: string;
  attendance: string | null;
  volunteer: boolean | null;
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

  // Check if already registered for this event to honor unique (event_id, person_id).
  const { data: existing, error: existingError } = await client
    .from("registrations")
    .select("id")
    .eq("event_id", payload.eventId)
    .eq("person_id", person.id)
    .maybeSingle();

  if (existingError && existingError.code !== "PGRST116") {
    return { data: null, error: existingError };
  }

  if (existing) {
    return {
      data: null,
      error: new Error("You are already registered for this event."),
    };
  }

  const { data, error } = await client
    .from("registrations")
    .insert({
      person_id: person.id,
      event_id: payload.eventId,
      attendance: payload.attendance,
      volunteer: payload.volunteer,
    })
    .select()
    .single();

  if (error) {
    // Handle unique constraint in case of race condition.
    if (error.code === "23505" || error.code === "409") {
      return {
        data: null,
        error: new Error("You are already registered for this event."),
      };
    }
    return { data: null, error };
  }

  return { data: data as SupabaseRegistration, error: null };
};
