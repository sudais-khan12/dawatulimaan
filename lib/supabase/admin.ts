import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Supabase service role configuration is missing. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
  );
}

let adminClient: ReturnType<typeof createClient> | null = null;

export const getAdminSupabaseClient = () => {
  if (!adminClient) {
    adminClient = createClient(supabaseUrl, serviceRoleKey);
  }
  return adminClient;
};
