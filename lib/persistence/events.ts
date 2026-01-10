import { getSupabaseClient } from "@/lib/supabase/client";

export type EventRow = {
  id: string;
  slug: string;
  title?: string | null;
  date?: string | null;
};

export const getEventBySlug = async (
  slug: string,
  client = getSupabaseClient(),
): Promise<{ data: EventRow | null; error: Error | null }> => {
  const { data, error } = await client
    .from("events")
    .select("id, slug, title")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return { data: null, error };
  }

  return { data: (data as EventRow) ?? null, error: null };
};

export const getAllEvents = async (
  client = getSupabaseClient(),
): Promise<{ data: EventRow[]; error: Error | null }> => {
  const { data, error } = await client
    .from("events")
    .select("id, slug, title, date")
    .order("date", { ascending: true });

  if (error || !data) {
    return { data: [], error: error ?? new Error("No events found") };
  }

  return { data: data as EventRow[], error: null };
};
