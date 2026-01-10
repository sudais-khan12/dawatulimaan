"use server";

import { getSupabaseClient } from "@/lib/supabase/client";

export const deleteRegistrationAction = async (registrationId: string) => {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("registrations")
    .delete()
    .eq("id", registrationId)
    .select("person_id")
    .single();

  if (error) {
    throw error;
  }

  const personId = data?.person_id as string | undefined;

  if (personId) {
    // Clean up people with no remaining registrations
    await client
      .from("people")
      .delete()
      .eq("id", personId)
      .not("id", "in", client.from("registrations").select("person_id"));
  }

  return { success: true };
};
