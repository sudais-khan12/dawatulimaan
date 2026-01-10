import { getSupabaseClient } from "@/lib/supabase/client";

export type EventRow = {
  id: string;
  slug: string;
  title?: string | null;
  date?: string | null;
  location?: string | null;
  type?: string | null;
  description?: string | null;
};

export const getEventBySlug = async (
  slug: string,
  client = getSupabaseClient(),
): Promise<{ data: EventRow | null; error: Error | null }> => {
  const { data, error } = await client
    .from("events")
    .select("id, slug, title, date, location, type, description")
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
    .select("id, slug, title, date, location, type, description")
    .order("date", { ascending: true });

  if (error || !data) {
    return { data: [], error: error ?? new Error("No events found") };
  }

  return { data: data as EventRow[], error: null };
};

export const getUpcomingEvents = async (
  client = getSupabaseClient(),
): Promise<{ data: EventRow[]; error: Error | null }> => {
  const { data, error } = await client
    .from("events")
    .select("id, slug, title, date, location, type, description")
    .order("date", { ascending: true });

  if (error || !data) {
    return { data: [], error: error ?? new Error("No events found") };
  }

  return { data: data as EventRow[], error: null };
};

export type CreateEventInput = {
  title: string;
  slug: string;
  date: string;
  location?: string | null;
  type: "virtual" | "in-person";
  description?: string | null;
};

export const createEvent = async (
  input: CreateEventInput,
  client = getSupabaseClient(),
): Promise<{ data: EventRow | null; error: Error | null }> => {
  const { data, error } = await client
    .from("events")
    .insert({
      title: input.title,
      slug: input.slug,
      date: input.date,
      location: input.location ?? null,
      type: input.type,
      description: input.description ?? null,
    })
    .select("id, slug, title, date, location, type, description")
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: data as EventRow, error: null };
};
