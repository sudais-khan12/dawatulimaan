"use server";

import { getSupabaseClient } from "@/lib/supabase/client";

export const deleteEventAction = async (eventId: string) => {
  const client = getSupabaseClient();

  // Remove email logs for this event
  await client.from("event_email_sends").delete().eq("event_id", eventId);

  // Remove registrations and capture affected people
  const { data: deletedRegs, error: regError } = await client
    .from("registrations")
    .delete()
    .eq("event_id", eventId)
    .select("person_id");

  if (regError) {
    throw regError;
  }

  const personIds =
    deletedRegs?.map((r: { person_id: string }) => r.person_id) ?? [];

  if (personIds.length > 0) {
    // Remove people that no longer have registrations
    await client
      .from("people")
      .delete()
      .in("id", personIds)
      .not("id", "in", client.from("registrations").select("person_id"));
  }

  const { error: eventError } = await client
    .from("events")
    .delete()
    .eq("id", eventId);

  if (eventError) {
    throw eventError;
  }

  return { success: true };
};
