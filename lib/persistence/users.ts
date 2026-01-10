import bcrypt from "bcryptjs";

import { getSupabaseClient } from "@/lib/supabase/client";

export type UserRow = {
  id: string;
  email: string;
  password: string;
  role: string;
};

export type CreateUserInput = {
  email: string;
  password: string;
  role?: string;
};

const mapUser = (row: UserRow) => ({
  id: row.id,
  email: row.email,
  role: row.role,
});

export const createUser = async (
  input: CreateUserInput,
  client = getSupabaseClient(),
): Promise<{ data: { id: string; email: string; role: string } | null; error: Error | null }> => {
  const hashed = await bcrypt.hash(input.password, 10);
  const role = input.role ?? "admin";

  const { data, error } = await client
    .from("users")
    .insert({
      email: input.email,
      password: hashed,
      role,
    })
    .select("id, email, role")
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: data as { id: string; email: string; role: string }, error: null };
};

export const authenticateUser = async (
  email: string,
  password: string,
  client = getSupabaseClient(),
): Promise<{ data: { id: string; email: string; role: string } | null; error: Error | null }> => {
  const { data, error } = await client
    .from("users")
    .select("id, email, password, role")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    return { data: null, error };
  }

  if (!data) {
    return { data: null, error: new Error("Invalid credentials") };
  }

  const isValid = await bcrypt.compare(password, (data as UserRow).password);
  if (!isValid) {
    return { data: null, error: new Error("Invalid credentials") };
  }

  if ((data as UserRow).role !== "admin") {
    return { data: null, error: new Error("Insufficient permissions") };
  }

  return { data: mapUser(data as UserRow), error: null };
};

export const getUserById = async (
  id: string,
  client = getSupabaseClient(),
): Promise<{ data: { id: string; email: string; role: string } | null; error: Error | null }> => {
  const { data, error } = await client
    .from("users")
    .select("id, email, role")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { data: null, error };
  }

  if (!data) {
    return { data: null, error: new Error("User not found") };
  }

  return { data: data as { id: string; email: string; role: string }, error: null };
};

export const getAllUsers = async (
  client = getSupabaseClient(),
): Promise<{ data: UserLite[]; error: Error | null }> => {
  const { data, error } = await client
    .from("users")
    .select("id, email, role, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return { data: [], error: error ?? new Error("No users found") };
  }

  return { data: data as UserLite[], error: null };
};

export type UserLite = {
  id: string;
  email: string;
  role: string;
  created_at?: string | null;
};
