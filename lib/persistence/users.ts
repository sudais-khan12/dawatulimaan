import { getSupabaseClient } from "@/lib/supabase/client";

export type UserRow = {
  id: string;
  email: string;
  created_at?: string | null;
};

export type CreateUserInput = {
  email: string;
};

const mapUser = (row: UserRow) => ({
  id: row.id,
  email: row.email,
  role: "admin" as const,
  created_at: row.created_at,
});

export const createUser = async (
  input: CreateUserInput,
  client = getSupabaseClient()
): Promise<{
  data: { id: string; email: string; role: string } | null;
  error: Error | null;
}> => {
  const { data, error } = await client
    .from("users")
    .insert({
      email: input.email,
    })
    .select("id, email, created_at")
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: mapUser(data as UserRow), error: null };
};

export const getAllUsers = async (
  client = getSupabaseClient()
): Promise<{ data: UserLite[]; error: Error | null }> => {
  const { data, error } = await client
    .from("users")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return { data: [], error: error ?? new Error("No users found") };
  }

  return { data: (data as UserRow[]).map(mapUser) as UserLite[], error: null };
};

export type UserLite = {
  id: string;
  email: string;
  role: string;
  created_at?: string | null;
};
