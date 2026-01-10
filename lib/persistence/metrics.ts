import { getSupabaseClient } from "@/lib/supabase/client";

export const getDashboardCounts = async (client = getSupabaseClient()) => {
  const [{ count: events }, { count: registrations }, { count: users }] =
    await Promise.all([
      client.from("events").select("*", { count: "exact", head: true }),
      client.from("registrations").select("*", { count: "exact", head: true }),
      client.from("users").select("*", { count: "exact", head: true }),
    ]);

  return {
    events: events ?? 0,
    registrations: registrations ?? 0,
    users: users ?? 0,
  };
};

export const getRecentRegistrations = async (
  limit = 5,
  client = getSupabaseClient(),
) => {
  const { data, error } = await client
    .from("registrations")
    .select(
      "id, created_at, attendance, people:person_id(email, first_name, last_name), event:event_id(title)",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data.map((row: any) => ({
    id: row.id,
    createdAt: row.created_at as string | null,
    attendance: row.attendance as string | null,
    person:
      `${row.people?.first_name ?? ""} ${row.people?.last_name ?? ""}`.trim() ||
      row.people?.email ||
      "Unknown",
    email: row.people?.email ?? "Unknown",
    event: row.event?.title ?? "Event",
  }));
};
